// 2Do
// check custom scalar types in graphql https://kamranicus.com/posts/2018-07-02-handling-multiple-scalar-types-in-graphql

import { gql } from 'apollo-server-express';

const intervalSchema = gql`
   extend type Query {
      intervals: [Interval!]
      interval(id: ID!): Interval
   }

   extend type Mutation {
      intervalCreate(
         projectId: ID!
         timetableId: ID!
         title: String
         position: Float
      ): Interval!
      intervalUpdate(
         id: ID!
         title: String
         duration: Int
         position: Float
      ): Interval!
      intervalDelete(id: ID!): Interval!
      intervalFieldUpdate(
         intervalId: ID!
         intervalFieldId: ID!
         duration: Int
         time: Int
         title: String
         text: String
      ): IntervalField!
   }

   type IntervalField {
      id: ID
      columnId: ID
      duration: Int
      time: Int
      title: String
      text: String
   }

   type Interval {
      id: ID
      userId: ID
      projectId: ID!
      timetableId: ID!
      createdAt: Date
      updatedAt: Date
      duration: Int
      title: String
      position: Float
      fields: [IntervalField!]
   }
`;

export default intervalSchema;
