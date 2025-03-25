import { verifyToken } from "../services/token.services.mjs";

const auth = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded =await verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

const authenticateSocket = async (socket, next) => {
  const token = socket.handshake.headers["authorization"];
  if (!token) {
    const error = new Error("Authentication error: Token is required.");
    error.data = { code: 401 };
    return next(error);
  }

  try {
    const decoded = await verifyToken(token);
    socket.user = decoded;
    next();
  } catch (err) {
    const error = new Error("Authentication error: Invalid token.");
    error.data = { code: 403 };
    next(error);
  }
};

export { auth, authorize, authenticateSocket };
