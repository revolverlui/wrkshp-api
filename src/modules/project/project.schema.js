import { gql } from 'apollo-server-express';

const projectSchema = gql`
   extend type Query {
      projects: [Project!]
      project(id: ID!): Project
   }

   extend type Mutation {
      createProject(title: String!): Project!
      updateProject(id: ID!, title: String, public: Boolean): Project!
      deleteProject(id: ID!): Project!
   }

   type Project {
      id: ID
      userId: ID
      createdAt: Date
      updatedAt: Date
      public: Boolean
      collaborative: Boolean
      title: String!
   }
`;

export default projectSchema;