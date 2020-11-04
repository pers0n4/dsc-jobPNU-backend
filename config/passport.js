const { Strategy: LocalStrategy } = require("passport-local");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
require("./env");

const User = require("../models/user");

const localStrategy = new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: "User not found" });
      }

      if (!(await user.verifyPassword(password))) {
        return done(null, false, { message: "Wrong password" });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (!user) {
        return done(null, false, { message: "User not found" });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

module.exports = {
  localStrategy,
  jwtStrategy,
};
