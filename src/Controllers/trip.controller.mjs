import Trip from "../Models/trip.model.mjs";
import User from "../Models/user.model.mjs";
import { calculateDistance } from "../utils/distanceCalculator.mjs";

const createTrip = async (req, res) => {
  try {
    const { user } = req;
    const { ...details } = req.body;

    const passengerFound = await User.findOne({ _id: user._id });

    if (!passengerFound) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    // search for the nearest drivers from the passenger
    const nearbyDrivers = await User.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [
              details.startLocation.lat,
              details.startLocation.long,
            ],
          },
          $maxDistance: 5000,
        },
      },
      status: "available",
      role: "driver",
    })
      .sort("-score")
      .limit(10);

    if (nearbyDrivers.length == 0) {
      return res.status(200).json({
        success: true,
        data: "no drivers nearst your location",
      });
    }

    const distance = calculateDistance(
      [details.startLocation.lat, details.startLocation.long],
      [details.endLocation.lat, details.endLocation.long]
    );
    const passengerTripRequest = new Trip({
      passenger: user._id,
      startLocation: {
        type: "Point",
        coordinates: [details.startLocation.lat, details.startLocation.long],
      },
      endLocation: {
        type: "Point",
        coordinates: [details.endLocation.lat, details.endLocation.long],
      },
      fare: details.fare,
      distance,
    });

    await passengerTripRequest.save();

    return res.status(201).json({
      success: true,
      data: {
        nearestDrivers: nearbyDrivers,
        tripRequest: passengerTripRequest,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export { createTrip };
