import { ApolloError } from "apollo-server";

class CustomError extends ApolloError{

  message: string;
  constructor(message: string){
    super(message)
    this.message= message
  }
  
}

export default CustomError