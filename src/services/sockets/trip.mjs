import Trip from "../../Models/trip.model.mjs";
import User from "../../Models/user.model.mjs";

const initialize = async (nsp) => {
  nsp.on("connection", async (socket) => {
    const user = socket.user;

    try {
      await updateSocketId(user, socket.id);
    } catch (error) {
      handleError("Error updating user socket ID", error, socket);
      return;
    }

    switch (user.role) {
      case "passenger":
        handlePassengerEvents(socket, nsp);
        break;
      case "driver":
        handleDriverEvents(socket, nsp);
        break;
      default:
        console.warn(`Unknown role: ${user.role}`);
        socket.disconnect();
    }
  });
};

const updateSocketId = async (user, socketId) => {
  const updated = await User.findByIdAndUpdate(
    { _id: user._id },
    { $set: { socketId } },
    { new: true }
  );
  if (!updated)
    throw new Error(`Failed to update socket ID for user: ${user._id}`);
  console.log(`User connected: ${user._id}, Role: ${user.role}`);
};

const handlePassengerEvents = (socket, nsp) => {
  console.log(`Passenger connected: ${socket.id}`);

  socket.on("joinRoom", ({ tripId }) =>
    safeHandler(() => joinRoom(socket, tripId), "joinRoom")
  );

  socket.on("SendTripToDrivers", ({ nearestDrivers, tripRequest }) =>
    safeHandler(
      () => sendTripToDrivers(nsp, nearestDrivers, tripRequest),
      "SendTripToDrivers"
    )
  );

  socket.on("passengerShareLocation", ({ tripId, location }) =>
    safeHandler(
      () => shareLocation(nsp, tripId, location, "passengerLocation"),
      "passengerShareLocation"
    )
  );

  socket.on("passengerCanceledTrip", ({ tripId }) =>
    safeHandler(() => leaveRoom(socket, tripId), "passengerCanceledTrip")
  );

  socket.on("disconnect", () =>
    console.log(`Passenger disconnected: ${socket.id}`)
  );
};

const handleDriverEvents = (socket, nsp) => {
  console.log(`Driver connected: ${socket.id}`);

  socket.on("acceptTrip", (tripId) =>
    safeHandler(() => acceptTrip(socket, tripId), "acceptTrip")
  );

  socket.on("driverShareLocation", ({ tripId, location }) =>
    safeHandler(
      () => shareLocation(nsp, tripId, location, "driverLocation"),
      "driverShareLocation"
    )
  );

  socket.on("driverCanceledTrip", ({tripId}) =>
    safeHandler(() => cancelTrip(socket, tripId), "driverCanceledTrip")
  );

  socket.on("disconnect", () =>
    console.log(`Driver disconnected: ${socket.id}`)
  );
};

const joinRoom = (socket, tripId) => {
  socket.join(`trip-${tripId}`);
  console.log(`Joined trip room: trip-${tripId}`);
};

const leaveRoom = (socket, tripId) => {
  socket.leave(`trip-${tripId}`);
  console.log(`Left trip room: trip-${tripId}`);
};

const sendTripToDrivers = (nsp, nearestDrivers, tripRequest) => {
  nearestDrivers.forEach((driver) => {
    nsp.to(driver.socketId).emit("newTripRequest", { data: tripRequest });
  });
  console.log(
    "Trip sent to drivers:",
    nearestDrivers.map((d) => d.socketId)
  );
};

const shareLocation = (nsp, tripId, location, event) => {
  nsp.to(`trip-${tripId}`).emit(event, { location });
  console.log(`${event} shared for trip-${tripId}:`, location);
};

const acceptTrip = async (socket, tripId) => {
  const driver = socket.user;
  socket.join(`trip-${tripId}`);
  const updatedTrip = await Trip.findByIdAndUpdate(
    tripId,
    { $set: { driver: driver._id, status: "accepted" } },
    { new: true }
  );
  if (!updatedTrip) throw new Error("Trip not found");
  console.log(`Driver accepted trip: trip-${tripId}`);
};

const cancelTrip = async (socket, tripId) => {
  socket.leave(`trip-${tripId}`);
  const updatedTrip = await Trip.findByIdAndUpdate(
    tripId,
    { $set: { driver: undefined , status: "canceled" } },
    { new: true }
  );
  if (!updatedTrip) throw new Error("Trip not found");
  console.log(`Trip canceled: trip-${tripId}`);
};

const handleError = (message, error, socket) => {
  console.error(`${message}:`, error);
  socket.disconnect();
};

const safeHandler = async (callback, eventName) => {
  try {
    await callback();
  } catch (error) {
    console.error(`Error in ${eventName}:`, error);
  }
};

export default initialize;
