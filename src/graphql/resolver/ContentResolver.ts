import { ApolloError } from "apollo-server";
import Content, { ContentSchema } from "../../model/Content";
import { Context } from "../../utility/contextType";
import Category, { CategorySchema } from "../../model/Category";
import customError from "../../helper/customErrorFunction";
import User from "../../model/User";
import cloudinary from "../../config/cloudinary";
import colors from "colors"

export default {
  Content:{
    user: async(parent:ContentSchema, __:any, _ctx:Context) =>{
      const user= await User.findByPk(parent.userId)
      if(!user){
        throw new ApolloError("User not found")
      }
      return user
    },
    category: async(parent: ContentSchema, __:any, _ctx:Context) =>{
      const category= await Category.findByPk(parent.categoryId)
      if(!category){
        throw new ApolloError("Category not found")
      }
      return category
    }
  },
  Query:{
    contents: async(_:any, __:any, {user}: Context) =>{
      if(!user?.id) throw new ApolloError("User not authorized")
      
      const content = await Content.findAll({where: { userId: user.id }, order: [['createdAt', 'desc']]})
      return content

    },
    content: async(_:any, { id }: {id:string}, {user}: Context ) =>{

      if(!user) throw new ApolloError("User not authorized")

      const content = await Content.findByPk(id) as ContentSchema
      await customError({ data: content, userId: user?.id!, model: Content   })

      if(!content) throw new ApolloError("Content not found")

      return content
    }
  },
  Mutation:{
    createContent: async(_:any, { categoryId, input }: { categoryId: string, input: ContentSchema }, {user}:Context ) =>{
      
      if(!user?.id) throw new ApolloError("User not authorized")
      const { title, description, photo } = input
      let cloud

      if(!title){
        throw new ApolloError("Please input the title")
      }
      if (!description){
        throw new ApolloError("Please input the description")
      }
      
      const category= await Category.findByPk(categoryId) as CategorySchema
      await customError({data: category, userId: user.id, model: Category })

      if(photo !== ''){
        cloud= await cloudinary.v2.uploader.upload(photo, {
          upload_preset: "mgt_assets"
        })
      }

      const values={
        title,
        description,
        photo: cloud?.secure_url ?? '',
        publicIdImg: cloud?.public_id ?? '',
        userId: user?.id,
        categoryId
      }
      const content = await Content.create(values) as ContentSchema
      return content

    },
    updateContent: async(_:any, { id, input }: { id: string, input: ContentSchema }, {user}: Context) =>{
      
      if(!user?.id) throw new ApolloError("User not authorized")

      const { title, description, categoryId, photo } = input
      let cloud
      const content = await Content.findByPk(id) as ContentSchema
      await customError({ data: content, userId: user?.id, model: Content })

      const category= await Category.findByPk(categoryId) as CategorySchema
      await customError({ data: category, userId: user?.id, model: Category })

      if(photo !== ''){
        cloud= await cloudinary.v2.uploader.upload(photo, {
          public_id: content.publicIdImg,
          upload_preset: "mgt_assets"
        })
      }

      content.title= title
      content.description= description
      content.photo = cloud?.secure_url ?? ''
      content.categoryId= categoryId
      content.publicIdImg= cloud?.public_id ?? ''
      return content.save()

    },
    deleteContent: async (_:any, { id }: { id: string }, {user}: Context) =>{
      
      if(!user?.id) throw new ApolloError("User not authorized")
      const content = await Content.findByPk(id) as ContentSchema

      await customError({ data: content, userId: user.id, model: Content })
      if(!content) throw new ApolloError("Content not found")

      if(content.publicIdImg){
        cloudinary.v2.uploader.destroy(content.publicIdImg)
      }
      content.destroy()
      
      return content

    }
  }

}