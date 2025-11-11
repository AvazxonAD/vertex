const express = require("express");

const router = express.Router();

// import routes
const JurnalRoutes = require("./jurnal/index");
const AuthRoutes = require("./auth/index");
const FieldRoutes = require("./field/index");
const ArticleRoutes = require("./article/index");

// Auth routes
router.use("/auth", AuthRoutes);
router.use("/jurnals", JurnalRoutes);
router.use("/fields", FieldRoutes);
router.use("/articles", ArticleRoutes);

module.exports = router;
