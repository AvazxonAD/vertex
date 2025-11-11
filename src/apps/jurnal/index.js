const express = require("express");
const { Controller } = require("./controller");
const { Schema } = require("./schema");
const { validator } = require("../../middleware/validator");
const { protect } = require("../../middleware/auth");

const router = express.Router();

router.get("/", validator(Controller.get, Schema.get()));
router.get("/:id", validator(Controller.getById, Schema.getById()));
router.post("/", protect, validator(Controller.create, Schema.create()));
router.put("/:id", protect, validator(Controller.update, Schema.update()));
router.delete("/:id", protect, validator(Controller.delete, Schema.delete()));

module.exports = router;
