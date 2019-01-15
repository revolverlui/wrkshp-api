import { gql } from 'apollo-server-express';
import { mergeSchemas } from 'graphql-tools';

import userSchema from './user/user.schema';

console.log('userSchema', userSchema);

const mergedSchemas = mergeSchemas({
   schemas: [
      userSchema,
   ],
});

export default mergedSchemas;

// import userSchema from './user/user.schema';

// const linkSchema = gql`
//   scalar Date
//   type Query {
//     _: Boolean
//   }
//   type Mutation {
//     _: Boolean
//   }
//   type Subscription {
//     _: Boolean
//   }
// `;

// export default [linkSchema, userSchema];