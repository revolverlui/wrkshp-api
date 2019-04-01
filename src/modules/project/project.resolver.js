import { stringIdToObjectId } from '../../utils/db.utils';

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
      meProjects: async (parent, args, { models, me }) => {
         return await models.Project.find({
            userId: stringIdToObjectId(me.id)
         });
      }
   },
   Mutation: {
      projectCreate: async (parent, { title }, { models, me }) => {
         console.log('createProject', title, me, typeof me.id);
         const project = await models.Project.create({
            userId: me.id,
            title: title
         });

         return project;
      },
      projectUpdate: async (parent, { id, ...rest }, { models, me }) => {
         console.log('updateProject', id, rest, rest.id);
         const project = await models.Project.findOneAndUpdate(
            { _id: id },
            {
               ...rest
            },
            { new: true }
         );

         return project;
      },
      projectDelete: async (parent, { id }, { models, me }) => {
         return await models.Project.findByIdAndDelete(id);
      }
   },
   Project: {
      timetables: async (parent, args, { models, me }) => {
         const timetables = await models.Timetable.find({
            projectId: parent.id
         });
         return timetables;
      }
   }
};
