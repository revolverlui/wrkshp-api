import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import cors from 'cors';
import morgan from 'morgan';

import mongoose from 'mongoose';

import { getMe } from './modules/auth';
import Ac from './modules/auth/accesscontrol';

let options = [{
  role: 'ADMIN',
  can: ['user:create', 'user:read', 'user:update', 'user:delete'],
  inherits: 'CUSTOMER'
}, {
  role: 'CUSTOMER',
  can: ['project:create', 'project:read', 'project:update', 'project:delete'],
  inherits: 'USER'

}, {
  role: 'USER',
  can: ['user:create', 'user:read', 'user:update', 'user:delete'],
}];

const AC = new Ac(options);

const app = express();

app.use(cors());
app.use(morgan('dev'));

import { schema, resolvers, models } from './modules';
//import resolvers from './modules/resolvers';
//import models from './modules/models';


mongoose.connect(
  'mongodb://localhost:27017/wrkshp-dev',
  { useNewUrlParser: true }
);

// async connect(connectionString: string): Promise<void> {
//   this.client = await MongoClient.connect(connectionString)
//   this.db = this.client.db()
// }

// mongoose.connection.on('error', () => {
//   throw new Error(`unable to connect to database: ${process.env.MONGODB_URI}`);
// });

mongoose.connection.on('connected', () => {
  console.log('Mongoose default connection open to ' + process.env.MONGODB_URI, process.env.AUTH_TOKEN_SECRET);
});

// const connectDb = async () => {
//   const db = await mongoose.connect('mongodb://localhost:27017/wrkshp-dev');
//   return db;
// }


const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async ({req}) => {
    const secret = process.env.AUTH_TOKEN_SECRET;
    const me = await getMe(req, secret);

    console.log('me', me);

    return {
      req,
      me,
      secret: secret,
      models
    }
  },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});