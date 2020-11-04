const express = require("express");
const router = express.Router();

const passport = require("passport");
const jwt = require("jsonwebtoken");
require("../config/env");

/**
 * @openapi
 * /auth:
 *  post:
 *    tags:
 *      - auth
 *    summary: Authenticate
 *    operationId: createToken
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *              password:
 *                type: string
 *                format: password
 *                example: password
 *            required:
 *              - email
 *              - password
 *    responses:
 *      200:
 *        description: jwt token
 *      401:
 *        description: authenticate fail
 */
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

/**
 * @openapi
 * /auth:
 *  get:
 *    tags:
 *      - auth
 *    summary: Verify jwt token
 *    operationId: verifyToken
 *    responses:
 *      200:
 *        description: verified user
 *      401:
 *        description: authenticate fail
 *    security:
 *      - jwtToken: []
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json(req.user);
  }
);

module.exports = router;
