import multer from "multer";
import path from "path";

// Set up the storage engine for multer
const storage = multer.diskStorage({
  // Define the destination for uploaded files
  destination: function (req, file, cb) {
    cb(null, "src/uploads/");
  },
  // Define the filename for uploaded files
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname);
    const newFilename = `${timestamp}${fileExtension}`;
    cb(null, newFilename);
  },
});

// Define the file filter to control which files are accepted
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  if (extname && mimeType) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpeg, jpg, png)"));
  }
};

// Set up the multer middleware with the defined storage engine and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export default upload;
