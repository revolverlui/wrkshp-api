// load environment variables with dotenv from .env in dev
// https://stackoverflow.com/questions/10560241/how-to-use-nodemon-with-env-files
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { applyMiddleware } from 'graphql-middleware';

import cors from 'cors';
import morgan from 'morgan';

import mongoose from 'mongoose';

import { getMe } from './modules/auth';
import permissions from './modules/auth/permissions';
import { schema, resolvers, models } from './modules';

const app = express();

app.use(cors());
app.use(morgan('dev'));

// delay for debug - opimisticResponse on client side
// app.use(function(req, res, next) {
//    setTimeout(next, 2000);
// });

//import resolvers from './modules/resolvers';
//import models from './modules/models';

// https://stackoverflow.com/questions/56465695/unhandled-promise-rejection-this-error-originated-either-by-throwing-inside-of
const connectDB = async () => {};

// https://dev.to/cpclark360/how-to-host-a-restful-node-js-server-with-mongodb-atlas-database-on-heroku-1opl
// https://stackoverflow.com/questions/54890608/how-to-use-async-await-with-mongoose
// const connectDb = async () => {
//    try {
//        await mongoose.connect(dbConfig.url, dbConfigOptions)

//        console.info(`Connected to database on Worker process: ${process.pid}`)
//    } catch (error) {
//        console.error(`Connection error: ${error.stack} on Worker process: ${process.pid}`)
//        process.exit(1)
//    }
// }

// https://stackoverflow.com/questions/52572852/deprecationwarning-collection-findandmodify-is-deprecated-use-findoneandupdate
mongoose.connect(process.env.MONGODB_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useFindAndModify: false
});

// async connect(connectionString: string): Promise<void> {
//   this.client = await MongoClient.connect(connectionString)
//   this.db = this.client.db()
// }

// mongoose.connection.on('error', () => {
//   throw new Error(`unable to connect to database: ${process.env.MONGODB_URI}`);
// });
console.log('env', process.env);
mongoose.connection.on('connected', () => {
   console.log(
      'Mongoose default connection open to ' + process.env.MONGODB_URI
   );
});

// mongoose.connection.on('error', () => {
//    throw new Error(`unable to connect to database: ${process.env.MONGODB_URI}`);
// });

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
   introspection: true,
   playground: true,
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

app.listen({ port: process.env.PORT }, () => {
   console.log(`Apollo Server on http://localhost:${process.env.PORT}/graphql`);
});
