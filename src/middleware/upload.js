const multer = require("multer");
const path = require("path");

const imageStorage = (folder) => {
  return multer.diskStorage({
    destination: `./public/${folder}`,
    filename: function (req, file, cb) {
      cb(null, file.originalname.split(".")[0] + "-" + Date.now() + path.extname(file.originalname));
    },
  });
};

const multiUploadStorage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    cb(null, file.originalname.split(".")[0] + "-" + Date.now() + path.extname(file.originalname));
  },
});

function checkImageFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /image\/jpeg|image\/png|image\/gif|image\/webp/.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Xato: Faqat image fayllarini yuklash mumkin"));
  }
}

exports.uploadImage = (folder) => {
  return multer({
    storage: imageStorage(folder),
    limits: { fileSize: 54428800 },
    fileFilter: function (req, file, cb) {
      checkImageFileType(file, cb);
    },
  });
};

exports.multiUpload = multer({
  storage: multiUploadStorage,
  limits: { fileSize: 104857600 },
});
