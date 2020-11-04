const express = require("express");
const router = express.Router();

const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    openapi: "3.0.n",
    info: {
      title: "DSC jobPNU Backend",
      version: "0.0.0",
    },
    components: {
      securitySchemes: {
        jwtToken: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "Bearer",
        },
      },
    },
  },
  apis: ["./routes/**/*.js"],
});

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerSpec));

module.exports = router;
