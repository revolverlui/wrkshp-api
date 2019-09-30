import { gql } from 'apollo-server-express';

const timetableSchema = gql`
   extend type Query {
      timetables: [Timetable!]
      timetable(id: ID!): Timetable
   }

   extend type Mutation {
      timetableCreate(projectId: ID!, title: String): Timetable!
      timetableUpdate(
         id: ID!
         projectId: ID
         title: String
         startAt: Int
         endAt: Int
      ): Timetable!
      timetableDelete(id: ID!): Timetable!
   }

   type Timetable {
      id: ID
      userId: ID
      projectId: ID!
      createdAt: Date
      updatedAt: Date
      startAt: Int
      endAt: Int
      title: String
      intervals: [Interval!]
   }
`;

export default timetableSchema;
