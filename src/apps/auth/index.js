const express = require("express");
const { AuthController } = require("./controller");
const { AuthSchema } = require("./schema");
const { validator } = require("../../middleware/validator");

const router = express.Router();

router.post("/login", validator(AuthController.login, AuthSchema.loginSchema()));

module.exports = router;
