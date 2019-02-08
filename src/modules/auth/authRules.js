import { rule } from 'graphql-shield';

const isAuthenticated = rule()(async (parent, args, { me }, info) => {
   console.log('authRULE', me);
   return me !== undefined;
})

// unclear if that works OR if it needs to work like the collaboratot rule, incl. a model
const isOwner = rule()(async (parent, args, { me }, info) => {
   console.log('PERMISSION: isOwner >', me.id, args.userId, parent);
   return me.id === args.userId;
});

const isAdmin = rule()(async (parent, args, { me }, info) => {
   return me.role === 'ADMIN'
});

const isCollaborator = (model) => rule()(async (parent, args, { models }, info) => {
   console.log('isCollaborator 1', model);
   const result = await models[model].findById('5c432fc72b20aa705f111003').populate('projectId');
   console.log('isCollaborator 2', result);
   return true; //ctx.user.role === 'editor'
});


export {
   isAuthenticated,
   isAdmin,
   isOwner,
   isCollaborator
}