import sequelize from "../config/sequelize";
import { DataTypes } from "sequelize";

export interface UserSchema{
  id?: string,
  name?: string
  email?: string,
  password?: string,
  role?: string,
  isAdmin?: Boolean,
  isActive?: Boolean,
  createdAt?:Date,
  updatedAt?: Date,
  save():unknown
}

const User= sequelize.define('user', {
  id:{
    type: DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true,
    allowNull:false
  },
  name:{
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{
        msg: "Please input the name"
      }
    }
  },
  email:{
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{
        msg: "Please input the email",
      },
      isEmail:{
        msg: "Email invalid"
      }
    }
  },
  password:{
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{
        msg: "Please input the password"
      }
    }
  },
  role:{
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      isIn: {
        args:[['user', 'admin']],
        msg: "Invalid Value"
      }
    },
    defaultValue: 'user'
  },
  isAdmin:{
    type: DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue:false
  },
  isActive:{
    type: DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue:true
  }
}, {timestamps:true })

export default User