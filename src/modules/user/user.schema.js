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
      userDelete(id: String!): User
   }

   type Token {
      token: String!
   }

   # Individual human
   type User {
      id: ID!
      email: String!
      password: String!
      role: String!
   }
`;

export default userSchema;