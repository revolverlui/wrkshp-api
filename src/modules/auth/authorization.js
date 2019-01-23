import { ForbiddenError } from 'apollo-server';
import { combineResolvers, skip } from 'graphql-resolvers';
import { isAuthenticated } from './authentication';

const isAdmin = combineResolvers(
   isAuthenticated,
   (parent, args, { me: { role } }) =>
      role === 'ADMIN'
         ? skip
         : new ForbiddenError('Not authorized.'),
);

const isUser = combineResolvers(
   isAuthenticated,
   (parent, args, { me: { role } }) =>
      role === 'USER'
         ? skip
         : new ForbiddenError('Not authorized.'),
);

const isProjectOwner = async (parent, { id }, { models, me }) => {
   const project = await models.Project.findById(id);

   if (project.userId !== me.id) {
      throw new ForbiddenError('Not authenticated as owner.');
   }

   return skip;
};

const isProjectOwnerOrCollaborator = async (parent, { id }, { models, me }) => {
   


   const project = await models.Project.findById(id);

   const isOwner = project.userId === me.id;
   const isCollaborator = project.collaborators.includes(me.id);

   if (!isOwner && !isCollaborator) {
      throw new ForbiddenError('Not authorized.');
   }

   return skip;
};

export {
   isAdmin,
   isUser,
   isProjectOwner,
   isProjectOwnerOrCollaborator
}