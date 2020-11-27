const express = require("express");
const router = express.Router();

const passport = require("passport");
const jwt = require("jsonwebtoken");
require("../config/env");

/**
 * @openapi
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */

/**
 * @openapi
 * /auth:
 *  post:
 *    tags:
 *      - Auth
 *    summary: Create token
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
 *        description: JWT token
 *      401:
 *        description: Unauthorized
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
 *      - Auth
 *    summary: Verify token
 *    operationId: verifyToken
 *    responses:
 *      200:
 *        description: Verified User
 *      401:
 *        description: Unauthorized
 *    security:
 *      - bearerAuth: []
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json(req.user);
  }
);

/**
 * @openapi
 * /auth/refresh:
 *  post:
 *    tags:
 *      - Auth
 *    summary: Refresh token
 *    operationId: refreshToken
 *    responses:
 *      200:
 *        description: JWT token
 *      401:
 *        description: Unauthorized
 *    security:
 *      - bearerAuth: []
 */
router.post(
  "/refresh",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    req.login(req.user, { session: false }, async (error) => {
      if (error) {
        return next(error);
      }

      const token = jwt.sign(req.user.toJSON(), process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({ token });
    });
  }
);

module.exports = router;
