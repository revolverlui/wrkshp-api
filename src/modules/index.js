import { gql } from 'apollo-server-express';
import { GraphQLDateTime } from 'graphql-iso-date';

import userSchema from './user/user.schema';
import projectSchema from './project/project.schema';
import timetableSchema from './timetable/timetable.schema';

import userResolvers from './user/user.resolver';
import projectResolvers from './project/project.resolver';
import timetableResolver from './timetable/timetable.resolver';

import User from './user/user.model';
import Project from './project/project.model';
import Timetable from './timetable/timetable.model';


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
  userSchema,
  projectSchema,
  timetableSchema
];


const customScalarResolver = {
  Date: GraphQLDateTime,
};

const resolvers = [
  customScalarResolver,
  userResolvers,
  projectResolvers,
  timetableResolver
];


const models = {
  User,
  Project,
  Timetable
};


export {
  schema,
  resolvers,
  models
}