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

router.patch("/:id", (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(404).send(error.message);
    });
});

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
