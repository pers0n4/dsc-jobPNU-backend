const path = require("path");

const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: path.join(__dirname, ".env.production") });
} else if (process.env.NODE_ENV === "development") {
  dotenv.config();
}

const app = express();

const connect = () => {
  mongoose.connection
    .on("error", () => console.error("error"))
    .on("disconnected", connect)
    .once("open", () => console.log("success"));
  return mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
};

connect();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

module.exports = app;
