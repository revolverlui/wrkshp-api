// 2Do
// change userId to createdBy?

import mongoose from 'mongoose';

const intervalFieldSchema = new mongoose.Schema({
   columnId: mongoose.Schema.Types.ObjectId,
   duration: { type: Number },
   time: { type: Number },
   title: { type: String },
   text: { type: String },
   user: { type: mongoose.Schema.Types.ObjectId }
});

const intervalSchema = new mongoose.Schema({
   // createdBy
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      get: v => v.toString(),
      required: true
   },
   projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      get: v => v.toString(),
      required: true
   },
   timetableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Timetable',
      get: v => v.toString(),
      required: true
   },
   createdAt: {
      type: Date,
      default: Date.now
   },
   updatedAt: {
      type: Date,
      default: Date.now
   },
   duration: {
      type: Number,
      default: 300 // 5 min in seconds
   },
   title: {
      type: String,
      required: true
   },
   position: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: v => parseFloat(v.toString())
   },
   fields: [intervalFieldSchema]
});

module.exports = mongoose.model('Interval', intervalSchema);
