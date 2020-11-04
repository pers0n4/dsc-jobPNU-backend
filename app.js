const path = require("path");
const http = require("http");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { logger, morgan } = require("./config/logger");
const passport = require("passport");
const { localStrategy, jwtStrategy } = require("./config/passport");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

// 환경변수 설정
require("./config/env");
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

// Express 생성
const app = express();

app.use(morgan());
app.use(
  cors({
    origin: new RegExp(`^(https?:\/\/)(${process.env.FRONT_URI})(:\\d+)?\/?$`),
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

app.set("port", process.env.PORT || 3000);

// Express 서버 시작
const server = http.createServer(app);

server.listen(app.get("port"));
server.on("error", (error) => {
  logger.error(error.message);
});
server.on("listening", () => {
  logger.info("Express server listening on " + app.get("port"));
});
