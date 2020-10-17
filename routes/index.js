const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
  res.status(200).send("dsc-jobPNU Express API server");
});

module.exports = router;
