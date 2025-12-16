require("colors");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Db } = require("./config/db/index");
const errorHandler = require("./middleware/errorHandler");
const responseHandler = require("./middleware/responseHandler");
const swagger = require("swagger-ui-express");
const { loadModuleSwagger } = require("./docs/swagger");
const routes = require("./apps/index");
const { i18next } = require("./middleware/i18next");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(responseHandler);

app.use(i18next, (req, res, next) => {
  console.log(req.url)
  req.i18n.changeLanguage(req.headers["x-app-lang"]);

  next();
});

const swagger_document = loadModuleSwagger();

app.use("/api", routes);

app.use("/docs", swagger.serve, swagger.setup(swagger_document));

app.use("*", (req, res) => {
  res.error("pageNotFound", 404);
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await Db.connectDB();

    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`.bgBlue);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`.yellow);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
