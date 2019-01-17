import { gql } from 'apollo-server-express';

import userSchema from './user/user.schema';

import userResolvers from './user/user.resolver';

import User from './user/user.model';


const linkSchema = gql`
  scalar Date
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
  type Subscription {
    _: Boolean
  }
`;

const schema = [
  linkSchema, 
  userSchema
];


const resolvers = [
  userResolvers,
];


const models = {
  User,
};


export {
   schema,
   resolvers,
   models
}