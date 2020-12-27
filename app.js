const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const { morgan } = require("./config/logger");
const { localStrategy, jwtStrategy } = require("./config/passport");
const swaggerRouter = require("./routes/swagger");
const usersRouter = require("./routes/users");
const studiesRouter = require("./routes/studies");
const authRouter = require("./routes/auth");

// Express 생성
const app = express();

app.use(morgan());
app.use(
  cors({
    origin: new RegExp(
      `^(https?:\/\/)(localhost|${process.env.FRONT_URI})(:\\d+)?\/?$`
    ),
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

app.use("/", swaggerRouter);
app.use("/users", usersRouter);
app.use("/studies", studiesRouter);
app.use("/auth", authRouter);

app.set("port", process.env.PORT || 3000);

module.exports = {
  app,
};
