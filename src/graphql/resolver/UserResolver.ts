import User, { UserSchema } from '../../model/User'
import generatedToken from '../../helper/generatedToken'
import bcryptjs from 'bcryptjs'
import { ApolloError, ApolloServer } from 'apollo-server'
import validator from 'validator'
import { Op } from 'sequelize'
import { Context } from '../../utility/contextType'

export default {
  Query: {
    users: async (_: any, __: any, { user: userObj }: Context) => {
      if (!userObj?.id) throw new ApolloError('User not authorized')

      const user = await User.findAll()
      if (user.length === 0) {
        throw new ApolloError('User not found')
      }
      return user
    },
    user: async (_: any, args: UserSchema, { user: userObj }: Context) => {
      if (!userObj?.id) throw new ApolloError('User not authorized')

      const user = await User.findOne({ where: { id: args.id } })
      if (!user) {
        throw new ApolloError('User not found')
      }
      return user
    },
    profile: async (_: any, __: any, { user }: Context) => {
      if (!user?.id) {
        throw new ApolloError('User not authorize')
      }
      return user
    },
  },
  Mutation: {
    registerUser: async (
      _: any,
      { input }: { input: UserSchema },
      _context: any,
    ) => {
      const { name, email, password } = input

      if (!name) {
        throw new ApolloError('Please input the name')
      }
      if (!email) {
        throw new ApolloError('Please input the email')
      }

      const emailRegx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      const emailValid = emailRegx.test(email!)
      if (!emailValid) {
        throw new ApolloError('Email invalid')
      }
      if (!password) {
        throw new ApolloError('Please input the password')
      }
      if (password.length < 6) {
        throw new ApolloError('Password should be atleast 6 characters')
      }

      const nameExist = await User.findOne({
        where: { name: { [Op.like]: `%${name.toLowerCase()}%` } },
      })
      if (nameExist) {
        throw new ApolloError('Name was already exist...!')
      }

      const emailExist = await User.findOne({
        where: { email: { [Op.like]: `%${email.toLowerCase()}%` } },
      })
      if (emailExist) {
        throw new ApolloError('Email was already exist...!')
      }

      const genSalt = await bcryptjs.genSalt(10)
      const hash = await bcryptjs.hash(password?.trim()!, genSalt)

      const values = {
        name: name?.trim(),
        email: email?.trim(),
        password: hash,
        role: 'user',
        isAdmin: false,
        isActive: true,
      }

      const user = (await User.create(values)) as UserSchema

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        token: generatedToken(user.id!),
      }
    },
    logInUser: async (_: any, { input }: { input: UserSchema }, _ctx: any) => {
      const { email, password } = input

      if (!email) {
        throw new ApolloError('Please input the email')
      }
      if (!validator.isEmail(email)) {
        throw new ApolloError('Email invalid')
      }
      if (!password) {
        throw new ApolloError('Please input the password')
      }

      const user = (await User.findOne({
        where: { email: { [Op.like]: `%${email.toLowerCase()}%` } },
      })) as UserSchema
      if (!user) {
        throw new ApolloError('Email incorrect...!')
      }
      if (password && !(await bcryptjs.compare(password, user.password!))) {
        throw new ApolloError('Password incorrect')
      }
      user.isActive = true
      user.save()

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isAdmin: user.isAdmin,
        token: generatedToken(user.id!),
      }
    },
    logOutUser: async (_: any, __: any, { user: auth }: Context) => {
      if (!auth?.id) throw new ApolloError('User not authorized')
      const user = (await User.findByPk(auth?.id)) as UserSchema
      user.isActive = false
      return user.save()
    },
  },
}
