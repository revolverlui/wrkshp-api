import mongoose from 'mongoose';
import { Number, String } from 'core-js';

const timetableColumnSchema = new mongoose.Schema({
   title: {
      type: String
   },
   width: {
      type: Number,
      required: true
   },
   position: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: v => parseFloat(v.toString())
   },
   type: {
      type: String,
      enum: [
         'duration',
         'time',
         'title',
         'text',
         'user-single',
         'user-multiple',
         'method'
      ]
   }
});

const timetableSchema = new mongoose.Schema({
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
   createdAt: {
      type: Date,
      default: Date.now
   },
   updatedAt: {
      type: Date,
      default: Date.now
   },
   startAt: {
      type: Number,
      default: 36000 // 10:00
   },
   endAt: {
      type: Number,
      default: 61200 // 17:00
   },
   title: {
      type: String,
      required: true
   },
   columns: [timetableColumnSchema]
});

module.exports = mongoose.model('Timetable', timetableSchema);
