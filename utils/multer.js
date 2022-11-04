//Upload images with multer
const multer = require("multer");
let storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});
let upload = multer({
  storage: storage,
});
module.exports = upload;
