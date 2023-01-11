import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

export interface CategorySchema{
  id?: string,
  userId?: string,
  title?: string,
  createdAt?: Date,
  updatedAt?:Date,
  destroy(): unknown,
  save():unknown
}

const Category = sequelize.define('category', {
  id:{
    type: DataTypes.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
  },
  title:{
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{
        msg: "Please input the title"
      }
    }
  },
}, {timestamps:true})

export default Category