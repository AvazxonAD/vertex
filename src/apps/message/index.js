const express = require("express");
const { Controller } = require("./controller");
const { MessageSchema } = require("./schema");
const { validator } = require("../../middleware/validator");

const router = express.Router();

// Public — user yangi xabar yuborishi (contact form)
router.post("/", validator(Controller.create, MessageSchema.createSchema()));

// Admin — ro'yxat, statistika, bitta xabar, javob, o'qildi, o'chirish
router.get("/", validator(Controller.get, MessageSchema.getAllSchema()));
router.get("/stats", Controller.stats);
router.get("/:id", validator(Controller.getById, MessageSchema.getByIdSchema()));
router.patch("/:id/read", validator(Controller.markRead, MessageSchema.getByIdSchema()));
router.post("/:id/reply", validator(Controller.reply, MessageSchema.replySchema()));
router.delete("/:id", validator(Controller.delete, MessageSchema.deleteSchema()));

module.exports = router;
