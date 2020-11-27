const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const router = express.Router();

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    openapi: "3.0.n",
    info: {
      title: "DSC jobPNU Backend",
      version: "0.0.0",
      description: "API endpoints",
    },
  },
  apis: ["./routes/**/*.js"],
});

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerSpec));

module.exports = router;
