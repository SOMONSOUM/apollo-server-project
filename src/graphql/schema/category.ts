import { gql } from "apollo-server";

export default gql`
  
  type Category{
    id: ID!,
    title:String!,
    user: User!
    createdAt: String!,
    updatedAt: String!,
  }

  type Page{
    page: Int
  }
  type Pagination{
    prev: Page,
    next: Page
  }
  type DataPagination{
    itemCount: Int,
    pageCount: Int,
    page: Int,
    limit: Int,
    allPages: [Int!],
    pagination: Pagination
  }

  type Error{
    message: String
  }
  type CategoryPayload{
    errors:[Error!]!,
    pagination: DataPagination,
    data: [Category!]!
  }

  input InputCategory{
    title:String!
  }

  type Query{
    categories(text: String, page: Int, limit: Int): CategoryPayload
    allCategories: CategoryPayload
    category(id: ID!): Category!
  }
  type Mutation{
    createCategory(input: InputCategory!): Category!
    updateCategory(id:ID!, input:InputCategory!): Category!
    deleteCategory(id: ID!): Category!
    searchCategory(text: String!, page: Int, limit: Int): [Category]
  }

`