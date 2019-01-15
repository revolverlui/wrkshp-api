import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import cors from 'cors';
import morgan from 'morgan';

import { importSchema } from 'graphql-import';

import userSchema from './modules/user/user.schema';

const app = express();

app.use(cors());
app.use(morgan('dev'));

import { schema } from './modules';
//import schema from './modules/schema';
//console.log('SCHEMA ', schema);
//import resolvers from './modules/resolvers';
import models from './modules/models';

// const schema = gql`
//   type Query {
//     me: User
//   }
//   type User {
//     username: String!
//   }
// `;

const resolvers = {
  Query: {
    // me: () => {
    //   return {
    //     username: 'Robin Wieruch',
    //   };
    // },
    users: (parent, args, context, info) => {
      //return context.prisma.users();
      return {data: 'hi'};
    },
  },
  Mutation: {
    createUser: async (parent, args, context, info) => {
      // const { name, email } = args.data;
      // console.log('createUser', name, email);
      // const user = await context.prisma.createUser({
      //   name: args.data.name,
      //   email: args.data.email,
      //   role: 'admin'
      // });

      // return user;
      return {data: 'hi'};

    }
  },
};

// const schema = importSchema(__dirname + '/generated/prisma.graphql');
// const typeDefs = gql`${schema}`;

//const importedSchema = importSchema(__dirname + '/schema.graphql');
const importedSchema = importSchema(__dirname + '/modules/user/userSchema.graphql');
//console.log('importedSchema', importedSchema);

const typeDefs = gql`${importedSchema}`;

console.log('userSchma', userSchema );


const server = new ApolloServer({
  typeDefs: schema,
  //typeDefs: userSchema,
  //typeDefs: schema, 
  resolvers,
  context: {
    models
  }
  // context: request => {
  //   console.log('request', request.body);
  //   return {
  //     ...request,
  //     prisma,
  //   }
  // },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});