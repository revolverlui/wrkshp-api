import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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


userSchema.pre('save', async function(next){
   this.password = await this.generateHashPassword();
   next();
});


// Statics (methods defined on the model level)
// https://gist.github.com/niksumeiko/f551eeb57a509bc27f9372978055c2e6
// https://stackoverflow.com/questions/51038621/mongoose-schema-statics-vs-methods
userSchema.statics.findByEmail = async function(email) {
   let user = await this.findOne({ email: email});
   return user;
};

// Methods (methods defined on the document level)
// fido.findSimilarTypes(function(err, dogs){
//    // dogs => [ {name:'fido',type:'dog} , {name:'sheeba',type:'dog'} ]
// });
userSchema.methods.generateHashPassword = async function(){
   return await bcrypt.hash(this.password, 10);
}

userSchema.methods.validatePassword = async function(password) {
   return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);