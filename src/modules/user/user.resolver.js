export default {
   Query: {
      users: async (parent, args, { models }) => {
         return await models.User.find();
      },
   }, 
   // Mutation: {
      
   // }
}