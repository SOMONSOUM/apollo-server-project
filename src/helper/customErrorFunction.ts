import { ApolloError } from "apollo-server"

interface CustomErrorFunction{
  data: any,
  userId: string,
  model: any
}
const customError = async ({data, userId, model}: CustomErrorFunction) =>{
  
  if(!data){
    throw new ApolloError(`${model.name.replace(/\b(\w)/g, (s:string) => s.toUpperCase())} not found`)
  }
  if(data.userId !== userId){
    throw new ApolloError(`User cannot access the ${model.name}`)
  }

}
export default customError