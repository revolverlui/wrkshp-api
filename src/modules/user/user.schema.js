import { gql } from 'apollo-server-express';

const userSchema = gql`
   extend type Query {
      users: [User!]
      user(id: ID!): User
      me: User
   }

   extend type Mutation {
      createUser(email: String!, password: String!): Token!
      login(email: String!, password: String!): Token!
      deleteUser(id: String!): User
   }

   type Token {
      token: String!
   }

   type User {
      id: ID!
      email: String!
      password: String!
      #role: String
   }
`;

export default userSchema;