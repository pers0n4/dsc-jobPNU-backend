// routes/studies.js

const express  = require('express');
const router = express.Router();
const Study = require('../models/study');

// Index 
router.post("/", (req, res) => {
  Study.create(req.body)
    .then((study) => {
      res.status(201).json(study);
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});//users.js베낌

// New
router.get('/new', function(req, res){
  res.render('study/new');
});

// // create
// router.post('/', function(req, res){
//   Post.create(req.body, function(err, post){
//     if(err) return res.json(err);
//     res.redirect('/studies');
//   });
// });

// // show
// router.get('/:id', function(req, res){
//   Post.findOne({_id:req.params.id}, function(err, post){
//     if(err) return res.json(err);
//     res.render('studies/show', {post:post});
//   });
// });

// // edit
// router.get('/:id/edit', function(req, res){
//   Post.findOne({_id:req.params.id}, function(err, post){
//     if(err) return res.json(err);
//     res.render('studies/edit', {post:post});
//   });
// });

// // update
// router.put('/:id', function(req, res){
//   req.body.updatedAt = Date.now(); //2
//   Post.findOneAndUpdate({_id:req.params.id}, req.body, function(err, post){
//     if(err) return res.json(err);
//     res.redirect("/studies/"+req.params.id);
//   });
// });

// // destroy
// router.delete('/:id', function(req, res){
//   Post.deleteOne({_id:req.params.id}, function(err){
//     if(err) return res.json(err);
//     res.redirect('/studies');
//   });
// });

module.exports = router;