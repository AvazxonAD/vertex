const fs = require("fs");
const path = require("path");
const YAML = require("yamljs");

function loadModuleSwagger() {
  const appsDir = path.join(__dirname, "../apps");
  const modules = fs.readdirSync(appsDir);

  const combined = {
    openapi: "3.0.0",
    info: {
      title: "Mobile API",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:4001/api" }, { url: "http://217.18.63.71:4001/api" }],
    paths: {},
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        CookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "refreshToken",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  };

  modules.forEach((mod) => {
    const swaggerPath = path.join(appsDir, mod, "swagger.yaml");
    if (fs.existsSync(swaggerPath)) {
      const doc = YAML.load(swaggerPath);
      Object.assign(combined.paths, doc.paths);
    }
  });

  return combined;
}

module.exports = { loadModuleSwagger };
