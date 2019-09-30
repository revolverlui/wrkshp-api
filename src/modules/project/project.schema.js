import { gql } from 'apollo-server-express';

const projectSchema = gql`
   extend type Query {
      projects: [Project!]
      project(id: ID!): Project
      meProjects: [Project!]
   }

   extend type Mutation {
      projectCreate(title: String!): Project!
      projectUpdate(id: ID!, title: String, public: Boolean): Project!
      projectDelete(id: ID!): Project!
   }

   type Project {
      id: ID
      userId: ID
      createdAt: Date
      updatedAt: Date
      public: Boolean
      collaborative: Boolean
      title: String!
      timetables: [Timetable!]
   }
`;

export default projectSchema;
