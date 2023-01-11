import { UserSchema } from "../model/User";

export interface Context{
  user: UserSchema | null
}