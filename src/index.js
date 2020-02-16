// load environment variables with dotenv from .env in dev
// https://stackoverflow.com/questions/10560241/how-to-use-nodemon-with-env-files
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { applyMiddleware } from 'graphql-middleware';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';

import mongoose from 'mongoose';

import {
   PORT,
   MONGODB_URI,
   WEB_APP_URL,
   SECRET_REFRESH_TOKEN_LABEL
} from './config';
import {
   getMe,
   verifyRefreshToken,
   sendRefreshToken,
   createAccessToken
} from './modules/auth';
import permissions from './modules/auth/permissions';
import { schema, resolvers, models } from './modules';

const app = express();

// https://www.npmjs.com/package/cors#configuring-cors-w-dynamic-origin
var corsOptions = {
   origin: (origin, callback) => {
      const whitelist = [WEB_APP_URL];
      console.log('origin', origin);
      if (whitelist.indexOf(origin) !== -1) {
         callback(null, true);
      } else {
         callback(new Error('Not allowed by CORS'));
      }
   },
   credentials: true
};

app.use(cors(corsOptions));
//app.use(cors()); // for grapql playground
app.use(morgan('dev'));
app.use(cookieParser());

app.use(async (req, res, next) => {
   console.log('req.cookies', req.cookies);
   //res.cookie('refresh-token', 'jhjhvjhvhv');
   next();
});

app.get('/', (_req, res) => res.send('hello'));

// get access token
app.post('/refresh-token', async (req, res) => {
   console.log('/refresh-token');
   const token = req.cookies[SECRET_REFRESH_TOKEN_LABEL];

   console.log('/refresh-token - token', token);
   if (!token) {
      return res.send({ ok: false, accessToken: '' });
   }

   let payload = null;
   try {
      payload = verifyRefreshToken(token);
      console.log('/refresh-token - payload', payload);
   } catch (err) {
      console.log(err);
      return res.send({ ok: false, accessToken: '' });
   }

   // token is valid and
   // we can send back an access token

   const user = await models.User.findById(payload.id);
   console.log('/refresh-token - user', user);
   if (!user) {
      return res.send({ ok: false, accessToken: '' });
   }

   console.log(
      '/refresh-token - user.tokenVersion',
      user.tokenVersion,
      payload.tokenVersion
   );
   if (user.tokenVersion !== payload.tokenVersion) {
      console.log(
         '/refresh-token - user.tokenVersion',
         user.tokenVersion,
         payload.tokenVersion
      );
      return res.send({ ok: false, accessToken: '' });
   }

   await sendRefreshToken(res, user);
   console.log('/refresh-token - sendRefreshToken');

   return res.send({ ok: true, accessToken: createAccessToken(user) });
});

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
mongoose.connect(MONGODB_URI, {
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
//console.log('env', process.env);
mongoose.connection.on('connected', () => {
   console.log('Mongoose default connection open to ' + MONGODB_URI);
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
   context: async ({ req, res }) => {
      const secret = process.env.AUTH_TOKEN_SECRET;
      const me = await getMe(req, secret);

      console.log('me', me);

      return {
         req,
         res,
         me,
         secret: secret,
         models
      };
   }
});

server.applyMiddleware({
   app,
   path: '/graphql',
   cors: false
});

app.listen({ port: PORT }, () => {
   console.log(`Apollo Server on http://localhost:${PORT}/graphql`);
});

// cors setting
// https://github.com/apollographql/apollo-server/issues/1142

// server.applyMiddleware({
//    app,
//    path: '/graphql',
//    cors: {
//       credentials: true,
//       origin: (origin, callback) => {
//          const whitelist = ['http://localhost:8080', 'https://site2.com'];

//          if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true);
//          } else {
//             callback(new Error('Not allowed by CORS'));
//          }
//       }
//    }
// });
