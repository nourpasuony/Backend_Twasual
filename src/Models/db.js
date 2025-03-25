import { connect } from 'mongoose';
  const connectDB = async () => {
    try {
      await connect("mongodb://127.0.0.1:27017/Tawasul", {
        serverSelectionTimeoutMS: 5000, 
        socketTimeoutMS: 45000,
      });
      console.log("MongoDB connected successfully");
    } catch (err) {
      console.error("MongoDB connection failed:", err.message);
      process.exit(1);
    }
  };


  connectDB();
