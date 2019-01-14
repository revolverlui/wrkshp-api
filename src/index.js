import dotenv from "dotenv";
dotenv.config();

const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
import { importSchema } from 'graphql-import';
const cors = require('cors');
const morgan = require('morgan');

const { prisma } = require('./generated/prisma-client')

const app = express();

app.use(cors());
app.use(morgan('dev'));

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
      return context.prisma.users();
    },
  },
  Mutation: {
    createUser: async (parent, args, context, info) => {
      const { name, email } = args.data;
      console.log('createUser', name, email);
      const user = await context.prisma.createUser({
        name: args.data.name,
        email: args.data.email,
        role: 'admin'
      });

      return user;

    }
  },
};

const schema = importSchema(__dirname + '/generated/prisma.graphql');
const typeDefs = gql`${schema}`;

const server = new ApolloServer({
  typeDefs: typeDefs,
  //typeDefs: schema, 
  resolvers,
  context: {
    prisma
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