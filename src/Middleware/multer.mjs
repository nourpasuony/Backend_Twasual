import multer, { diskStorage } from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Multer configuration
const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null,`${path.resolve(__dirname, '..')}/uploads`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});


const upload = multer({ storage });

const getUploadedPath = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded." });
  }
  req.urls = req.files.map((file) => file.path);
  next();
};
export {upload , getUploadedPath };
