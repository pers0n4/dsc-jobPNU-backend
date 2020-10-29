const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (await user.verifyPassword(req.body.password)) {
      res.status(200).send("success");
    } else {
      throw Error();
    }
  } catch (error) {
    res.status(401).send("fail");
  }
});

module.exports = router;
