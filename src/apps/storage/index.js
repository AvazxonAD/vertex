const express = require("express");
const { StorageController } = require("./controller");
const { validator } = require("../../middleware/validator");
const { multiUpload } = require("../../middleware/upload");

const router = express.Router();

router.post("/image", multiUpload.single("image"), validator(StorageController.create));
router.put("/image/:id", multiUpload.single("image"), validator(StorageController.update));
router.get("/image", validator(StorageController.get));
router.get("/image/:id", validator(StorageController.getById));
router.delete("/image/:id", validator(StorageController.delete));

module.exports = router;
