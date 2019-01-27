export default {
   Query: {
      intervals: async (parent, args, { models }, info) => {
         console.log('users QUERY', info.fieldNodes);
         return await models.Interval.find({});
      },
      interval: async (parent, { id }, { models }) => {
         return await models.Interval.findById(id);
      },
   },
   Mutation: {
      intervalCreate: async (parent, { projectId, timetableId, ...rest }, { models, me }, info ) => {
         console.log('intervalCreate', projectId, timetableId, rest);
         const interval = await models.Interval.create({
            projectId: projectId,
            timetableId: timetableId,
            userId: me.id,
            ...rest
         });

         return interval;
      },
      intervalUpdate: async (parent, { id, ...rest }, { models, me }) => {
         try {
            const interval = await models.Interval.findOneAndUpdate({ _id: id}, {
               ...rest
            }, { new: true });

            return interval;
         } catch(err){
            console.log('intervalUpdate ERROR', err);
         }
      },
      intervalDelete: async (parent, { id }, { models, me }) => {
         return await models.Interval.findByIdAndDelete(id);
      },
   }
}  