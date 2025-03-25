import { Server } from "socket.io";
import { authenticateSocket } from "../middleware/auth.middleware.mjs";
import tripService from "../services/sockets/trip.mjs";
import chatService from "../services/sockets/chat.mjs";

const initializeSocketServer = (server) => {
  var io = new Server(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"],
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 1000,
      skipMiddlewares: false, 
    },
  });

  // Initialize namespaces
  const namespaces = {
    trip: tripService,
    "trip/chat": chatService
  };

  // Initialize namespaces and attach middleware
  Object.entries(namespaces).forEach(([ns, handler]) => {
    const nsp = io.of(`/${ns}`);
    nsp.use((socket, next) => authenticateSocket(socket, next));
    handler(nsp);
  });
  return io;
};

export {initializeSocketServer};
