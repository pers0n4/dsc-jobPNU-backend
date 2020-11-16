// models/study.js

const mongoose = require('mongoose');

// const pointSchema = mongoose.Schema({
//   type: {
//     type: String,
//     enum: ['Point'],
//     required: true
//   },
//   coordinates: {
//     type: [Number],
//     required: true
//   }
// });
//member
const memberSchema = mongoose.Schema({
  member : {type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true}
});

// schema
const studySchema = mongoose.Schema({ // 1
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  title:{type:String, required:true},
  field:{type:String, required:true},
  num:{type:Number,required:true},
  content:{type:String},
  start_date:{type:Date,required:true},
  end_date:{type:Date,required:true},
  createdAt:{type:Date, default:Date.now}, // 2
  updatedAt:{type:Date},
  members : {type:[memberSchema]}
});



// model & export
const Study = mongoose.model("study", studySchema);

module.exports = Study;
