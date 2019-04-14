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
      intervalUpdate(id: ID!, title: String, position: Float): Interval!
      intervalDelete(id: ID!): Interval!
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
   }
`;

export default intervalSchema;
