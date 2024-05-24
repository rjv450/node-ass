import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
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

const upload = multer({ storage: storage });

export default upload;
