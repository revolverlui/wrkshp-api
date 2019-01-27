export default {
   Query: {
      timetables: async (parent, args, { models }, info) => {
         console.log('users QUERY', info.fieldNodes);
         return await models.Timetable.find({});
      },
      timetable: async (parent, { id }, { models }) => {
         return await models.Timetable.findById(id);
      },
   },
   Mutation: {
      timetableCreate: async (parent, { projectId, ...rest }, { models, me }, info ) => {
         console.log('createTimetable QUERY', info.fieldNodes);
         console.log('createTimetable', projectId, rest);
         const timetable = await models.Timetable.create({
            projectId: projectId,
            userId: me.id,
            ...rest
         });

         return timetable;
      },
      timetableUpdate: async (parent, { id, ...rest }, { models, me }) => {
         try {
            const timetable = await models.Timetable.findOneAndUpdate({ _id: id}, {
               ...rest
            }, { new: true });

            return timetable;
         } catch(err){
            console.log('updateTimetable ERROR', err);
         }
      },
      timetableDelete: async (parent, { id }, { models, me }) => {
         return await models.Timetable.findByIdAndDelete(id);
      },
   }
}  