export default {
   Query: {
      projects: async (parent, args, { models }) => {
         console.log('projects QUERY', args);
         //return 'hi';
         return await models.Project.find({});
      },
      project: async (parent, { id }, { models }) => {
         return await models.Project.findById(id);
      },
   },
   Mutation: {
      createProject: async (parent, { title }, { models, me }) => {
         console.log('createProject', title, me, typeof me.id);
         const project = await models.Project.create({
            userId: me.id,
            title: title
         });

         return project;
      },
      updateProject: async (parent, { id , ...rest }, { models, me }) => {
         console.log('updateProject', id, rest, rest.id);
         const project = await models.Project.findOneAndUpdate({ _id: id}, {
            ...rest
         }, { new: true });

         return project;
      },
      deleteProject: async (parent, { id }, { models, me }) => {
         return await models.Project.findByIdAndDelete(id);
      },
   }
}  