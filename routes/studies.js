// routes/studies.js

const express = require("express");
const router = express.Router();
const Study = require("../models/study");

/**
 * @openapi
 * components:
 *  schemas:
 *    Study:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          readOnly: true
 *        user:
 *          type: string
 *          example: user
 *        title:
 *          type: string
 *          example: title
 *        field:
 *          type: string
 *          example: field
 *        location:
 *          type: object
 *          properties:
 *            type:
 *              type: string
 *              example: Point
 *            coordinates:
 *              type: array
 *              items:
 *                type: number
 *              example: [35.22963606932526, 129.08935815999115]
 *        num:
 *          type: integer
 *          example: 4
 *        content:
 *          type: string
 *          example: content
 *        start_date:
 *          type: string
 *          format: date
 *          example: 2020-10-02
 *        end_date:
 *          type: string
 *          format: date
 *          example: 2020-12-28
 */

/**
 * @openapi
 * /studies:
 *  post:
 *    tags:
 *      - Study
 *    summary: Create a study
 *    operationId: createStudy
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Study"
 *    responses:
 *      201:
 *        description: Created study
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Study"
 *      400:
 *        description: Bad request
 */
// Index
router.post("/", (req, res) => {
  Study.create(req.body)
    .then((study) => {
      res.status(201).json(study);
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

/**
 * @openapi
 * /studies:
 *  get:
 *    tags:
 *      - Study
 *    summary: Get all studies
 *    operationId: getStudies
 *    responses:
 *      200:
 *        description: All studies
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/Study"
 */
// New
router.get("/", async (req, res) => {
  const studies = await Study.find();
  res.status(200).json(studies);
});

/**
 * @openapi
 * /studies/{id}:
 *  get:
 *    tags:
 *      - Study
 *    summary: Find a study
 *    operationId: findStudy
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Found study
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Study"
 *      400:
 *        description: Not found
 */
//leader
router.get("/:id", function (req, res) {
  Study.findById(req.params.id).then((study) => {
    res.status(200).json(study);
  });
});

/**
 * @openapi
 * /studies/{id}/members:
 *  post:
 *    tags:
 *      - Study
 *    summary: Add a member to study
 *    operationId: addMember
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              member:
 *                type: string
 *                example: user
 *    responses:
 *      201:
 *        description: Add member
 *      202:
 *        description: Accepted
 *      404:
 *        description: Not found
 */
//members
router.post("/:id/members", (req, res) => {
  Study.findById(req.params.id)
    .then((study) => {
      // console.log(study.members);
      if (study.members.length < study.num) {
        study.mem(req.body.member, req.body.status);
        res.sendStatus(201);
      }
      return res.status(202).send("인원을 초과하였습니다.");
    })
    .catch((error) => {
      res.status(404).send(error.message);
    });
});

module.exports = router;
