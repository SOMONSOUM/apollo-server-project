import { ApolloServer, gql } from 'apollo-server'
import colors from 'colors'
import _ from 'lodash'
import dotenv from 'dotenv'
import user from './graphql/schema/user'
import sequelize from './config/sequelize'
import User from './model/User'
import UserResolver from './graphql/resolver/UserResolver'
import Category from './model/Category'
import Content from './model/Content'
import authTokenMiddleware from './middleware/getUserFromToken'
import { Context } from './utility/contextType'
import CategoryResolver from './graphql/resolver/CategoryResolver'
import category from './graphql/schema/category'
import content from './graphql/schema/content'
import ContentResolver from './graphql/resolver/ContentResolver'

dotenv.config()
const PORT = process.env.PORT || 8000

const typeBaseDefs = gql`
  type Query
`
const server = new ApolloServer({
  typeDefs: [typeBaseDefs, user, category, content],
  resolvers: _.merge({}, UserResolver, CategoryResolver, ContentResolver),
  context: async ({ req }): Promise<Context> => {
    const user = await authTokenMiddleware(req.headers.authorization!)
    return {
      user,
    }
  },
})

sequelize
  .sync({ alter: true })
  .then((url) => {
    console.log(
      colors.green.inverse.bold(
        `Connection Successfully ${process.env.HOST}-${process.env.DATABASE}-${process.env.USERNAME}`,
      ),
    )
  })
  .catch((err: any) => {
    console.error(
      colors.red.underline.bold(`Connection Problem ${err.message}`),
    )
  })

Category.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Category)

Category.belongsToMany(User, { through: { model: Content, unique: false } })
User.belongsToMany(Category, { through: { model: Content, unique: false } })

server
  .listen()
  .then(({ url }) => {
    console.log(
      colors.cyan.inverse.bold(
        `Server in ${process.env.NODE_ENV} is running on ${url}`,
      ),
    )
  })
  .catch((err) => {
    console.log(colors.red.underline.bold(`Error Problem ${err}`))
  })
