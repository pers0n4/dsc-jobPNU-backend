const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.post("/", (req, res) => {
  User.create(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

router.get("/", async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

router.get("/:_id", (req, res) => {
  User.findById(req.params._id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(404).send(error.message);
    });
});

router.put("/", (req, res) => {
  res.sendStatus(405);
});

router.patch("/", (req, res) => {
  res.sendStatus(405);
});

router.put("/:_id", (req, res) => {
  res.sendStatus(405);
});

router.patch("/:_id", (req, res) => {
  User.findByIdAndUpdate(req.params._id, req.body, { new: true })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(404).send(error.message);
    });
});

router.delete("/", (req, res) => {
  res.sendStatus(405);
});

router.delete("/:_id", (req, res) => {
  User.findByIdAndDelete(req.params._id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((error) => {
      res.status(404).send(error.message);
    });
});

module.exports = router;
