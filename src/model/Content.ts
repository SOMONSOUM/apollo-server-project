import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

export interface ContentSchema{
  id?: string,
  userId?: string,
  categoryId?: string,
  title?: string,
  description?:string,
  photo?: string | any,
  publicIdImg?:string,
  save(): unknown,
  destroy():unknown
}

const Content= sequelize.define('content', {
  id:{
    type: DataTypes.INTEGER,
    allowNull:false,
    autoIncrement:true,
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
  description:{
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{
        msg: "Please input the description"
      }
    }
  },
  photo:{
    type: DataTypes.STRING,
  },
  publicIdImg: DataTypes.STRING
}, {timestamps:true})

export default Content