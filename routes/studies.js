// routes/studies.js

const express = require("express");
const router = express.Router();
const Study = require("../models/study");

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

// New
router.get("/", async (req, res) => {
  const studies = await Study.find();
  res.status(200).json(studies);
});

// show
// router.get('/:id', function(req, res){
//   Post.findOne({_id:req.params.id}, function(err, post){
//     if(err) return res.json(err);
//     res.render('studies/show', {post:post});
//   });
// });

module.exports = router;
