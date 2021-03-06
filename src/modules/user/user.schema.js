import { gql } from 'apollo-server-express';

const userSchema = gql`
   extend type Query {
      users: [User!]
      user(id: ID!): User
      me: User
   }

   extend type Mutation {
      userRegister(email: String!, password: String!): Token!
      userLogin(email: String!, password: String!): Token!
      userLogout: Success!
      userDelete(id: String!): User
   }

   type Token {
      token: String!
   }

   type Success {
      ok: Boolean!
   }

   # Individual human
   type User {
      id: ID!
      email: String!
      password: String!
      role: String!
      tokenVersion: Int
   }
`;

export default userSchema;
