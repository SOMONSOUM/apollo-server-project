import { gql } from "apollo-server";

export default gql`
  
  type Content{
    id: ID!,
    title: String!,
    description: String!,
    photo:String,
    user: User!,
    category: Category!,
    createdAt: String!,
    updatedAt:String!
  }
  input InputContent{
    title: String,
    description: String,
    photo: String,
    categoryId: String
  }

  type Query{
    contents: [Content!]!,
    content(id: ID!): Content!
  }
  type Mutation{
    createContent(categoryId: ID!, input: InputContent!): Content!
    updateContent(id: ID!, input: InputContent!): Content!
    deleteContent(id: ID!): Content!
  }

`