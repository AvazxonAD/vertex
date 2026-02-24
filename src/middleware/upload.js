const multer = require("multer");
const path = require("path");

const UPLOAD_BASE = process.env.UPLOAD_PATH;

const imageStorage = (folder) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(UPLOAD_BASE, folder);
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname.split(".")[0].replace(/\s+/g, "-") + "-" + Date.now() + path.extname(file.originalname));
    },
  });
};

const multiUploadStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdirSync(UPLOAD_BASE, { recursive: true });
    cb(null, UPLOAD_BASE);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.split(".")[0].replace(/\s+/g, "-") + "-" + Date.now() + path.extname(file.originalname));
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
