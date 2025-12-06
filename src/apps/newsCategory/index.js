const express = require("express");
const { Controller } = require("./controller");
const { CategorySchema } = require("./schema");
const { validator } = require("../../middleware/validator");

const router = express.Router();

router.get("/", validator(Controller.get, CategorySchema.getAllSchema()));
router.get("/:id", validator(Controller.getById, CategorySchema.getByIdSchema()));
router.post("/", validator(Controller.create, CategorySchema.createSchema()));
router.put("/:id", validator(Controller.update, CategorySchema.updateSchema()));
router.delete("/:id", validator(Controller.delete, CategorySchema.deleteSchema()));

module.exports = router;
