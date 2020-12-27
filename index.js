const http = require("http");
const mongoose = require("mongoose");

require("./config/env");
const { app } = require("./app");
const { logger } = require("./config/logger");

// 환경변수 설정
logger.debug("NODE_ENV=" + process.env.NODE_ENV);
logger.debug("MONGO_URI=" + process.env.MONGO_URI);
logger.debug("FRONT_URI=" + process.env.FRONT_URI);

// Mongoose 연결
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
});

mongoose.connection
  .on("error", (error) =>
    logger.error("Mongoose connection failed: " + error.message)
  )
  .once("connected", () => logger.info("Mongoose connection successful"));

// Express 서버 시작
const server = http.createServer(app);

server.listen(app.get("port"));
server.on("error", (error) => {
  logger.error(error.message);
});
server.on("listening", () => {
  logger.info("Express server listening on " + app.get("port"));
});
