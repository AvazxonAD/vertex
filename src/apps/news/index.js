const express = require("express");
const { Controller } = require("./controller");
const { Schema } = require("./schema");
const { validator } = require("../../middleware/validator");
const { multiUpload } = require("../../middleware/upload");

const router = express.Router();

router.get("/", validator(Controller.get, Schema.getAllSchema()));
router.get("/:file/:filename", validator(Controller.getFile, Schema.getFileSchema()));
router.get("/:id(\\d+)", validator(Controller.getById, Schema.getByIdSchema()));
router.post(
  "/",
  multiUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "gif", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  validator(Controller.create, Schema.createSchema())
);
router.put(
  "/:id",
  multiUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "gif", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  validator(Controller.update, Schema.updateSchema())
);
router.delete("/:id", validator(Controller.delete, Schema.deleteSchema()));

module.exports = router;
