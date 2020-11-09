const express = require("express");
const router = express.Router();

const User = require("../models/user");

/**
 * @openapi
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          format: email
 *        password:
 *          type: string
 *          format: password
 *          example: password
 *        name:
 *          type: string
 *          example: name
 */

/**
 * @openapi
 * /users:
 *  post:
 *    tags:
 *      - user
 *    summary: Create user
 *    operationId: createUser
 *    requestBody:
 *      description: user to create
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/User"
 *    responses:
 *      201:
 *        description: created user
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/User"
 *      400:
 *        description: bad request
 */
router.post("/", (req, res) => {
  User.create(req.body)
    .then((user) => {
      res.sendStatus(201);
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

/**
 * @openapi
 * /users:
 *  get:
 *    tags:
 *      - user
 *    summary: Get all users
 *    operationId: getUsers
 *    responses:
 *      200:
 *        description: all users
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/User"
 */
router.get("/", async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

router.put("/", (req, res) => {
  res.sendStatus(405);
});

router.patch("/", (req, res) => {
  res.sendStatus(405);
});

router.delete("/", (req, res) => {
  res.sendStatus(405);
});

router.post("/:id", (req, res) => {
  res.sendStatus(405);
});

/**
 * @openapi
 * /users/{id}:
 *  get:
 *    tags:
 *      - user
 *    summary: Find user
 *    operationId: findUser
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: user to select
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: found user
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/User"
 *      404:
 *        description: user not found
 */
router.get("/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(404).send(error.message);
    });
});

router.put("/:id", (req, res) => {
  res.sendStatus(405);
});

/**
 * @openapi
 * /users/{id}:
 *  patch:
 *    tags:
 *      - user
 *    summary: Update user
 *    operationId: updateUser
 *    parameters:
 *      - name: id
 *        in: path
 *        description: user to update
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              password:
 *                type: string
 *                format: password
 *                example: password
 *              name:
 *                type: string
 *                example: name
 *    responses:
 *      200:
 *        description: updated user
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/User"
 *      404:
 *        description: user not found
 */
router.patch("/:id", (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(404).send(error.message);
    });
});

/**
 * @openapi
 * /users/{id}:
 *  delete:
 *    tags:
 *      - user
 *    summary: Delete user
 *    operationId: deleteUser
 *    parameters:
 *      - name: id
 *        in: path
 *        description: user to delete
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      204:
 *        description: user deleted
 *      404:
 *        description: user not found
 */
router.delete("/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((error) => {
      res.status(404).send(error.message);
    });
});

module.exports = router;
