import mongoose from 'mongoose';

let timetableSchema = new mongoose.Schema({
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
      default: Date.now,
   },
   updatedAt: {
      type: Date,
      default: Date.now,
   },
   startAt: {
      type: Date,
      default: Date.now,
   },
   endAt: {
      type: Date,
      default: Date.now,
   },
   title: {
      type: String,
      required: true
   }
});

module.exports = mongoose.model('Timetable', timetableSchema);