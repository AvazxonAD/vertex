const express = require("express");

const router = express.Router();

// import routes
const JurnalRoutes = require("./jurnal/index");
const AuthRoutes = require("./auth/index");
const FieldRoutes = require("./field/index");
const ArticleRoutes = require("./article/index");
const NewsCategoryRoutes = require("./newsCategory/index");
const NewsRoutes = require("./news/index");
const NewsTags = require("./newsTag/index");
const StorageRoutes = require("./storage/index");
const ForAuthors = require("./forauthors/index");
const VolumeRoutes = require("./volume/index");

// Auth routes
router.use("/auth", AuthRoutes);
router.use("/news", NewsRoutes);
router.use("/jurnals", JurnalRoutes);
router.use("/fields", FieldRoutes);
router.use("/articles", ArticleRoutes);
router.use("/news-categories", NewsCategoryRoutes);
router.use("/news-tags", NewsTags);
router.use("/storage", StorageRoutes);
router.use("/forauthors", ForAuthors);
router.use("/volumes", VolumeRoutes);

module.exports = router;
