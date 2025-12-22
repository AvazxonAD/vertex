const express = require("express");
const { Controller } = require("./controller");
const { Schema } = require("./schema");
const { validator } = require("../../middleware/validator");

const router = express.Router();

router.get("/", validator(Controller.get, Schema.getAllSchema()));
router.get("/:id", validator(Controller.getById, Schema.getByIdSchema()));
router.post("/", validator(Controller.create, Schema.createSchema()));
router.put("/:id", validator(Controller.update, Schema.updateSchema()));
router.delete("/:id", validator(Controller.delete, Schema.deleteSchema()));

module.exports = router;
