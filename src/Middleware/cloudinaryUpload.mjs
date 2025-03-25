import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../Config/cloudinary.mjs";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads",
    format: async (req, file) => "jpg",
    public_id: (req, file) => file.originalname.split(".")[0]
  }
});

const upload = multer({ storage });

const uploadedImages = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded." });
  }
  req.imageUrls = req.files.map((file) => file.path);
  next();
};

export { upload, uploadedImages };