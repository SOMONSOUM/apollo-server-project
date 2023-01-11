import { Sequelize } from 'sequelize'
import { config } from 'dotenv'

config()
const sequelize = new Sequelize(
  `mysql://root:soksan@localhost:3306/project_apollo_server`,
  {
    host: `${process.env.HOST}`,
    dialect: 'mysql',
  },
)
export default sequelize
