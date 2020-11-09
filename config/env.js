const path = require("path");

if (process.env.NODE_ENV === "production") {
  require("dotenv").config({
    path: path.resolve(process.cwd(), ".env.production"),
  });
} else if (process.env.NODE_ENV === "development") {
  require("dotenv").config({
    path: path.resolve(process.cwd(), ".env.development"),
    debug: true,
  });
}

module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  FRONT_URI: process.env.FRONT_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};
