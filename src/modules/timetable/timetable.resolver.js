export default {
   Query: {
      timetables: async (parent, args, { models }) => {
         return await models.Timetable.find({});
      },
      timetable: async (parent, { id }, { models }) => {
         return await models.Timetable.findById(id);
      },
   },
   Mutation: {
      createTimetable: async (parent, { projectId, ...rest }, { models, me }) => {
         console.log('createTimetable', projectId, rest);
         const timetable = await models.Timetable.create({
            projectId: projectId,
            userId: me.id,
            ...rest
         });

         return timetable;
      },
      updateTimetable: async (parent, { id, ...rest }, { models, me }) => {
         try {
            const timetable = await models.Timetable.findOneAndUpdate({ _id: id}, {
               ...rest
            }, { new: true });

            return timetable;
         } catch(err){
            console.log('updateTimetable ERROR', err);
         }
      },
      deleteTimetable: async (parent, { id }, { models, me }) => {
         return await models.Timetable.findByIdAndDelete(id);
      },
   }
}  