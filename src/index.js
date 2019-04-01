import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { applyMiddleware } from 'graphql-middleware';

import cors from 'cors';
import morgan from 'morgan';

import mongoose from 'mongoose';

import { getMe } from './modules/auth';
import permissions from './modules/auth/permissions';

const app = express();

app.use(cors());
app.use(morgan('dev'));

// delay for debug - opimisticResponse on client side
// app.use(function(req, res, next) {
//    setTimeout(next, 2000);
// });

import { schema, resolvers, models } from './modules';
//import resolvers from './modules/resolvers';
//import models from './modules/models';

mongoose.connect('mongodb://localhost:27017/wrkshp-dev', {
   useNewUrlParser: true
});

// async connect(connectionString: string): Promise<void> {
//   this.client = await MongoClient.connect(connectionString)
//   this.db = this.client.db()
// }

// mongoose.connection.on('error', () => {
//   throw new Error(`unable to connect to database: ${process.env.MONGODB_URI}`);
// });

mongoose.connection.on('connected', () => {
   console.log(
      'Mongoose default connection open to ' + process.env.MONGODB_URI
   );
});

// const connectDb = async () => {
//   const db = await mongoose.connect('mongodb://localhost:27017/wrkshp-dev');
//   return db;
// }

const executableSchema = makeExecutableSchema({
   typeDefs: schema,
   resolvers
});

const schemaWithMiddleware = applyMiddleware(executableSchema, permissions);

const server = new ApolloServer({
   schema: schemaWithMiddleware,
   context: async ({ req }) => {
      const secret = process.env.AUTH_TOKEN_SECRET;
      const me = await getMe(req, secret);

      console.log('me', me);

      return {
         req,
         me,
         secret: secret,
         models
      };
   }
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
   console.log('Apollo Server on http://localhost:8000/graphql');
});
