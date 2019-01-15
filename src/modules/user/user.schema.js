import { gql } from 'apollo-server-express';

const userSchema = gql`
   extend type Query {
      users: [User!]
      user(id: ID!): User
      # me: User
   }

   extend type Mutation {
      createUser(email: String): User!
   }

   type Token {
      token: String!
   }

   type User {
      id: ID!
      email: String!
      #role: String
   }
`;

export default userSchema;