import { ApolloError } from 'apollo-server'
import Category, { CategorySchema } from '../../model/Category'
import { Context } from '../../utility/contextType'
import User, { UserSchema } from '../../model/User'
import customError from '../../helper/customErrorFunction'
import { Op } from 'sequelize'

interface Message {
  message: string
}
interface Pagination {
  prev?: { page: number }
  next?: { page: number }
}
interface DataPagination {
  itemCount?: number
  pageCount?: number
  page?: number
  limit?: number
  allPages?: number[]
  pagination?: Pagination
}
interface CategoryPayload {
  errors: Message[]
  pagination?: DataPagination
  data: CategorySchema[] | any
}

export default {
  Category: {
    user: async (
      parent: CategorySchema,
      __: any,
      { user: userToken }: Context,
    ) => {
      const user = (await User.findByPk(parent.userId)) as UserSchema
      if (!user) throw new ApolloError('User not found')
      return user
    },
  },
  Query: {
    categories: async (
      _: any,
      { text, page, limit }: { text: string; page: number; limit: number },
      { user }: Context,
    ): Promise<CategoryPayload> => {
      if (!user) throw new ApolloError('User not authorized')

      let fromPage, untilPage
      const reqPage = page || 1
      const reqLimit = limit || 1
      const start = (+reqPage - 1) * +reqLimit
      const end = +reqPage * +reqLimit
      const pagination: Pagination = {}
      const allPages: number[] = []

      let categories = Category.findAll({
        offset: start,
        limit: +reqLimit,
        where: { userId: user.id },
        order: [['createdAt', 'desc']],
      })
      let count = Category.count({ where: { userId: user.id } })

      if (text) {
        categories = Category.findAll({
          offset: start,
          limit: +reqLimit,
          where: {
            title: { [Op.like]: `%${text.toLowerCase()}%` },
            userId: user.id,
          },
          order: [['createdAt', 'desc']],
        })
        count = Category.count({
          where: {
            title: { [Op.like]: `%${text.toLowerCase()}%` },
            userId: user.id,
          },
        })
      }

      const data = await categories
      const countLength = await count
      const pageCount = Math.ceil(countLength / +reqLimit)

      fromPage = +reqPage === 1 ? 1 : +reqPage - 1
      untilPage = fromPage + 4

      if (data.length === 0) {
        return {
          errors: [{ message: 'Data not found' }],
          data: [],
        }
      }
      if (start > 0) {
        pagination.prev = {
          page: +reqPage - 1,
        }
      }
      if (end < countLength) {
        pagination.next = {
          page: +reqPage + 1,
        }
      }

      if (untilPage > pageCount) {
        untilPage = pageCount
        fromPage = untilPage - 4
      }

      for (
        let i = pageCount < 5 ? 1 : fromPage;
        pageCount < 5 ? i <= pageCount : i <= untilPage;
        i++
      ) {
        allPages.push(i)
      }

      const paginationResult: DataPagination = {
        itemCount: countLength,
        pageCount,
        page: +reqPage,
        limit: +reqLimit,
        allPages,
        pagination,
      }

      return {
        errors: [],
        pagination: paginationResult,
        data,
      }
    },
    allCategories: async (
      _: any,
      __: any,
      { user }: Context,
    ): Promise<CategoryPayload> => {
      if (!user) throw new ApolloError('User not authorized')
      const categories = await Category.findAll({
        where: { userId: user.id },
        order: [['createdAt', 'desc']],
      })

      if (categories.length === 0) {
        return {
          errors: [{ message: 'Categories not found' }],
          data: [],
        }
      }

      return {
        errors: [],
        data: categories,
      }
    },
    category: async (_: any, { id }: { id: string }, { user }: Context) => {
      if (!user) throw new ApolloError('User not authorized')
      const category = (await Category.findByPk(id)) as CategorySchema
      await customError({ data: category, userId: user.id!, model: Category })

      return category
    },
  },
  Mutation: {
    createCategory: async (
      _: any,
      { input }: { input: CategorySchema },
      { user }: Context,
    ) => {
      if (!user?.id) throw new ApolloError('User not authorized')
      const { title } = input

      if (!title) {
        throw new ApolloError('Please input the title')
      }

      const values = {
        title: title!.trim(),
        userId: user.id,
      }
      const category = await Category.create(values)
      return category
    },
    updateCategory: async (
      _: any,
      { id, input }: { id: string; input: CategorySchema },
      { user }: Context,
    ) => {
      const { title } = input
      if (!user?.id) throw new ApolloError('User not authorized')

      const category = (await Category.findByPk(id)) as CategorySchema
      await customError({ data: category, userId: user?.id!, model: Category })

      category.title = title
      return category.save()
    },
    deleteCategory: async (_: any, args: CategorySchema, { user }: Context) => {
      const { id } = args
      if (!user?.id) throw new ApolloError('User not authorized')

      const category = (await Category.findByPk(id)) as CategorySchema
      await customError({ data: category, userId: user.id!, model: Category })

      category.destroy()
      return category
    },
    searchCategory: async (
      _: any,
      { text, page, limit }: { text: string; page: number; limit: number },
      { user }: Context,
    ) => {
      if (!user) throw new ApolloError('User not authorized')
      if (!text) {
        throw new ApolloError('Please input the text')
      }

      const category = await Category.findAll({
        offset: page,
        limit,
        where: {
          title: { [Op.like]: `%${text.toLowerCase()}%` },
          userId: user.id,
        },
      })
      return category
    },
  },
}
