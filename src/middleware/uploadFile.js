import multer from "multer";
import path from "path";

// Configuring storage for uploaded files
const storage = multer.diskStorage({

  // Setting the destination directory where uploaded files will be stored
  destination: function (req, file, cb) {
    cb(null, "src/uploads/");
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname);
    const newFilename = `${timestamp}${fileExtension}`;
    cb(null, newFilename);
  },
});

// Creating a multer instance with the configured storage
const upload = multer({ storage: storage });

export default upload;
