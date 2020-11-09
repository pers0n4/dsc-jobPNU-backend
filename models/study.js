// models/study.js

const mongoose = require('mongoose');

// schema
const studySchema = mongoose.Schema({ // 1
  title:{type:String, required:true},
  field:{type:String, required:true},
  num:{type:Number,required:true},
  time:{type:String,required:true},
  period:{type:String,required:true},
  createdAt:{type:Date, default:Date.now}, // 2
  updatedAt:{type:Date},
});

// model & export
const Study = mongoose.model("study", studySchema);

module.exports = Study;