import mongoose from 'mongoose';

var ObjectId = mongoose.Types.ObjectId;

const stringIdToObjectId = (id) => {
   return new ObjectId(id);
}

export {
   stringIdToObjectId
}