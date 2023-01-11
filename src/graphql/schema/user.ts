import { gql } from "apollo-server";

export default gql`

  type User{
    id: ID!,
    name: String!,
    email: String!,
    password: String!,
    role: UserRole!,
    isAdmin: Boolean!,
    isActive: Boolean!,
    token: String
    createdAt: String!,
    updatedAt: String!
  }
  input UserRegisterInput{
    name: String!,
    email: String!,
    password: String!,
  }
  input UserLogInput{
    email: String!,
    password: String!,
  }
  enum UserRole{
    user
    admin
  }

  type Query{
    users: [User!]!,
    user(id: ID!): User!
    profile: User!
  }
  type Mutation{
    registerUser(input:UserRegisterInput!): User!
    logInUser(input: UserLogInput!): User!
    logOutUser: User!
  }

`