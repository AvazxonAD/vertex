const i18n = require("i18n");
const path = require("path");

i18n.configure({
  locales: ["uz", "en", "ru"],
  defaultLocale: "uz",
  directory: path.join(__dirname, "../locales"),
  objectNotation: true,
  autoReload: true,
  updateFiles: false,
  api: {
    __: "t",
    __n: "tn",
  },
});

module.exports = i18n;
