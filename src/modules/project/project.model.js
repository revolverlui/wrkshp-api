import mongoose from 'mongoose';

// https://github.com/Automattic/mongoose/issues/6996 
// http://thecodebarbarian.com/whats-new-in-mongoose-54-global-schematype-configuration.html#schematype-getters
// mongoose.ObjectId.get(v => v.toString());

let projectSchema = new mongoose.Schema({
   createdAt: {
      type: Date,
      default: Date.now,
   },
   updatedAt: {
      type: Date,
      default: Date.now,
   },
   // createdBy
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      get: v => v.toString(),
      //type: String,
      required: true
   },
   public: {
      type: Boolean,
      default: false
   },
   collaborative: {
      type: Boolean,
      default: false
   },
   collaborators: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      get: v => v.toString()
   }],
   title: {
      type: String,
      required: true
   }
});

// projectSchema.pre('save', async function(next){
//    console.log('projectSchema before', this.userId, typeof this.userId);
//    this.userId = await this.stringIdToObjectId();
//    console.log('projectSchema after', this.userId, typeof this.userId);
//    next();
// });


// // Methods (methods defined on the document level)
// projectSchema.methods.stringIdToObjectId = async function(){
//    const test = mongoose.Types.ObjectId(this.userId);
//    console.log('projectSchema.methods',test, typeof test );
//    return await mongoose.Types.ObjectId(this.userId);
// }

module.exports = mongoose.model('Project', projectSchema);