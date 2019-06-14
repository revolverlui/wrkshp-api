import { shield, and, or, not, allow } from 'graphql-shield';
import { ForbiddenError } from 'apollo-server-express';
import { isAuthenticated, isAdmin, isOwner, isCollaborator } from './authRules';

const permissions = shield(
   {
      Query: {
         users: and(isAuthenticated, isAdmin),
         user: and(isAuthenticated, or(isOwner, isAdmin)),
         me: and(isAuthenticated, or(isOwner, isAdmin)),

         projects: and(isAuthenticated, isAdmin),
         project: and(isAuthenticated, or(isOwner, isAdmin)),

         timetables: and(isAuthenticated, isAdmin),
         timetable: and(isAuthenticated, or(isOwner, isAdmin))
      },
      Mutation: {
         userRegister: or(not(isAuthenticated), isAdmin),
         userLogin: not(isAuthenticated),
         userDelete: and(isAuthenticated, or(isOwner, isAdmin)),

         projectCreate: isAuthenticated,
         projectUpdate: and(isAuthenticated, or(isOwner, isAdmin)),
         projectDelete: and(isAuthenticated, or(isOwner, isAdmin)),

         timetableCreate: isAuthenticated,
         timetableUpdate: isAuthenticated, //and(isAuthenticated, or(isOwner, isAdmin)),
         timetableDelete: and(isAuthenticated, or(isOwner, isAdmin)),

         intervalCreate: isAuthenticated,
         intervalUpdate: and(isAuthenticated, or(isOwner, isAdmin)),
         intervalDelete: and(isAuthenticated, or(isOwner, isAdmin))
      },
      User: allow,
      Project: allow,
      Timetable: allow
   },
   {
      fallbackError: new ForbiddenError('Not authorizated...')
   }
);

export default permissions;
