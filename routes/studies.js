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

//leader
router.get('/:id', function(req, res){
  Study.findById(req.params.id)
    .then((study) => {
      res.status(200).json(study);
    })
});   


//members
router.post("/:id/members", (req, res) => {
  Study.findById(req.params.id)
    .then((study) => {
      console.log(study.members)
      if(study.members.length < study.num){
      study.mem(req.body.member,req.body.status);
      res.sendStatus(201);
      }
      return res.status(202).send("인원을 초과하였습니다.")
    })
    .catch((error) => {
      res.status(404).send(error.message);
    });
});



module.exports = router;
