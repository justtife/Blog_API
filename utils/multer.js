//Upload images with multer
const multer = require("multer");
let storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + new Date().toISOString().replace(/:/g, '-') + "_" + file.originalname
    );
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb({ message: "Unsupported image format" }, false);
  }
};
let upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 },
  fileFilter,
});
module.exports = upload;
