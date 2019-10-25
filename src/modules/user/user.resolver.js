import { createToken } from '../auth';
import { ForbiddenError, AuthenticationError } from 'apollo-server-express';

export default {
   Query: {
      users: async (parent, args, { models }, info) => {
         console.log('users QUERY', info.fieldNodes);
         //return 'hi';
         return await models.User.find({});
      },
      user: async (parent, { id }, { models }) => {
         return await models.User.findById(id);
      },
      me: async (parent, args, { models, me }) => {
         return await models.User.findById(me.id);
      }
   },
   Mutation: {
      userRegister: async (parent, { email, password }, { models, secret }) => {
         console.log('userRegister', email, password);
         const user = await models.User.create({
            password: password,
            email: email,
            role: 'USER'
         });
         // 2do: only one call of createToken for login and register
         const token = await createToken(user, secret, '7 days');
         console.log('createToken from MUTATION', token);
         return { token: token };
         //return { token: createToken(user, secret, '30m') };
      },
      userDelete: async (parent, { id }, { models }) => {
         return await models.User.findByIdAndDelete(id);
      },
      userLogin: async (parent, { email, password }, { models, secret }) => {
         const user = await models.User.findByEmail(email);

         console.log('login', user, user.validatePassword);

         if (!user) {
            console.log('Enter valid credentials.');
            throw new UserInputError(
               'No user found with this login credentials.'
            );
         }

         const isValid = await user.validatePassword(password);

         if (!isValid) {
            console.log('Enter valid credentials.');
            throw new AuthenticationError('Authentication error');
         }

         return { token: createToken(user, secret, '7 days') };
      }
   }
};
