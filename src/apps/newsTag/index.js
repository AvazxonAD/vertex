const express = require("express");
const { TagController } = require("./controller");
const { TagSchema } = require("./schema");
const { validator } = require("../../middleware/validator");

const router = express.Router();

router.get("/", validator(TagController.get, TagSchema.getAllSchema()));
router.get("/:id", validator(TagController.getById, TagSchema.getByIdSchema()));
router.post("/", validator(TagController.create, TagSchema.createSchema()));
router.put("/:id", validator(TagController.update, TagSchema.updateSchema()));
router.delete("/:id", validator(TagController.delete, TagSchema.deleteSchema()));

module.exports = router;
