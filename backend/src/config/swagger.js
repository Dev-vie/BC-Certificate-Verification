const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const serverUrl = process.env.APP_BASE_URL || "http://localhost:3000";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Authentix API",
      version: "1.0.0",
      description: "Blockchain Certificate Verification System API",
    },
    servers: [
      {
        url: serverUrl,
        description: "API server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [path.join(__dirname, "../modules/**/*.routes.js")],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
