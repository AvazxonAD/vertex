const express = require("express");
const { Controller } = require("./controller");
const { Schema } = require("./schema");
const { validator } = require("../../middleware/validator");
const { multiUpload } = require("../../middleware/upload");
const router = express.Router();

router.get("/file/:file_name", validator(Controller.getFile, Schema.getFile()));
router.get("/", validator(Controller.get, Schema.get()));
router.get("/:id", validator(Controller.getById, Schema.getById()));
router.post("/", multiUpload.single("file"), validator(Controller.create, Schema.create()));
router.put("/:id", multiUpload.single("file"), validator(Controller.update, Schema.update()));
router.delete("/:id", validator(Controller.delete, Schema.delete()));

module.exports = router;
