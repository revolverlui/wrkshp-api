import mongoose from 'mongoose';

let userSchema = new mongoose.Schema({
   email: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 32
   },
   createdAt: {
      type: Date,
      default: Date.now
   }
});

module.exports = mongoose.model('User', userSchema);