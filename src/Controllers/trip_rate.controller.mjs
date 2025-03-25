// this file not use


import TripRate from "../Models/trip_rate.mjs";
import User from "../Models/user.model.mjs";

const passengerSendTripRate = async (req, res) => {
  try {
    const { _id } = req.user;
    const { ...details } = req.body;

    const passengerFound = await User.findOne({ _id });
    if (!passengerFound) {
      return res
        .status(404)
        .json({ success: false, error: "passenger not found" });
    }

    const passengerRate = new TripRate({
      passengerId: _id,
      ...details,
    });

    // driverId,
    // rate,
    // comment

    await passengerRate.save();

    return res.status(201).json({
      success: true,
      data: passengerRate,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


const getAllTripRatesforDriver = async (req, res) => {
  const { _id } = req.user;

  const driverRates = await TripRate.find({
    driverId: _id,
  });

  if (driverRates.length == 0) {
    return res.status(200).json({
      success: true,
      data: "no rate, yet",
    });
  }

  return res.status(200).json({
    success: true,
    data: driverRates,
  });
};

export { passengerSendTripRate, getAllTripRatesforDriver };
