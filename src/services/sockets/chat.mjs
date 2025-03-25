import Chat from "../../Models/chat.model.mjs";
import Trip from "../../Models/trip.model.mjs";
import User from "../../Models/user.model.mjs";

const chatService = (nsp) => {
  nsp.on("connection", async (socket) => {
    const user = socket.user;

    try {
      // Update user's socket ID in the database
      await safeHandler(() =>
        User.findByIdAndUpdate(user._id, { socketId: socket.id }, { new: true })
      );
      console.log(`User connected to chat: ${user._id} (Role: ${user.role})`);
    } catch (error) {
      handleError("Error updating user socket ID for chat", error, socket);
      return;
    }

    // Register event handlers
    handleChatEvents(socket, nsp);

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected from /chat: ${socket.id}`);
    });
  });
};

const handleChatEvents = (socket, nsp) => {
  socket.on("joinChatRoom", ({ tripId }) =>
    safeHandler(() => joinChatRoom(socket, tripId), "joinChatRoom")
  );

  socket.on("sendMessage", ({ tripId, text }) =>
    safeHandler(() => sendMessage(socket, nsp, tripId, text), "sendMessage")
  );

  socket.on("endChat", (tripId) =>
    safeHandler(() => endChat(socket, nsp, tripId), "endChat")
  );
};

const joinChatRoom = async (socket, tripId) => {
  const user = socket.user;
  const trip = await Trip.findById(tripId);

  if (!trip || !isUserPartOfTrip(user, trip)) {
    socket.emit("unauthorized", { message: "You are not authorized to join this chat." });
    return;
  }

  socket.join(`trip-${tripId}`);
  console.log(`User ${user._id} joined chat room: trip-${tripId}`);
};

const sendMessage = async (socket, nsp, tripId, text) => {
  const user = socket.user;
  const trip = await Trip.findById(tripId);

  if (!trip || !isUserPartOfTrip(user, trip)) {
    socket.emit("unauthorized", { message: "You are not authorized to send messages in this chat." });
    return;
  }

  const message = { sender: user._id, text };
  const chat = await Chat.findOneAndUpdate(
    { tripId },
    { $push: { messages: message } },
    { new: true, upsert: true }
  );

  nsp.to(`trip-${tripId}`).emit("newMessage", message);
  console.log(`Message sent by user ${user._id} in chat room trip-${tripId}:`, message);
};

const endChat = async (socket, nsp, tripId) => {
  const user = socket.user;
  const trip = await Trip.findById(tripId);

  if (!trip || !isUserPartOfTrip(user, trip)) {
    socket.emit("unauthorized", { message: "You are not authorized to end this chat." });
    return;
  }

  await Chat.findOneAndDelete({ tripId });
  nsp.to(`trip-${tripId}`).emit("chatEnded", { tripId });
  console.log(`Chat ended for trip ${tripId} by user ${user._id}`);
};

const isUserPartOfTrip = (user, trip) => {
  return trip.passenger.toString() === user._id.toString() || trip.driver.toString() === user._id.toString();
};

const safeHandler = async (callback, eventName) => {
  try {
    await callback();
  } catch (error) {
    console.error(`Error in ${eventName}:`, error);
  }
};

const handleError = (message, error, socket) => {
  console.error(`${message}:`, error);
  socket.disconnect();
};

export default chatService;
