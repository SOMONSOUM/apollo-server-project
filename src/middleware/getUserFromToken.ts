import jsonwebtoken from "jsonwebtoken"
import {config} from "dotenv"
import { ApolloError } from "apollo-server"
import User, { UserSchema } from "../model/User"

config()

interface JsonDecoded{
  id: string
}
const authTokenMiddleware = async (token: string) =>{

  // if(!token){
  //   throw new ApolloError("No Auth Token")
  // }

  try{
    const decoded= jsonwebtoken.verify(token, `${process.env.JWT_SECRET_KEY}`) as JsonDecoded
    const user= await User.findByPk(decoded.id) as UserSchema
    return user
  }catch(err){
    return null
    // throw new ApolloError("Auth Token Unauthorized")
  }

}
export default authTokenMiddleware