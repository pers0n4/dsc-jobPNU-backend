// models/study.js

var mongoose = require('mongoose');

// schema
var studySchema = mongoose.Schema({ // 1
  title:{type:String, required:true},
  field:{type:String, required:true},
  num:{type:Number,required:true},
  time:{type:String,required:true},
  period:{type:String,required:true},
  createdAt:{type:Date, default:Date.now}, // 2
  updatedAt:{type:Date},
});

// model & export
var study = mongoose.model('study', studySchema);
module.exports = Post;