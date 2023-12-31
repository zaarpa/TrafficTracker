const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const fileFilter = (req, file, cb) => {
  const allowedType = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedType.includes(file.mimetype)) {
    cb(null, true);
  } else cb(null, false);
};

const image = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

let uploadImage = multer({ storage: image, fileFilter });

const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      uuidv4() + "-" + Date.now().toString(16) + file.originalname + ".mp4"
    );
  },
});
const uploadVideo = multer({ preservePath: true, storage: videoStorage });

module.exports = { uploadImage, uploadVideo };
