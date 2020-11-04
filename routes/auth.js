const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("../config/env");

const router = express.Router();

router.post("/", async (req, res, next) => {
  passport.authenticate("local", async (error, user, info) => {
    try {
      if (error || !user) {
        return res.sendStatus(401);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) {
          return next(error);
        }

        const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        res.status(200).json({ token });
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json(req.user);
  }
);

module.exports = router;
