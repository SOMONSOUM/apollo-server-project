import { Sequelize } from 'sequelize'
import { config } from 'dotenv'

config()
const sequelize = new Sequelize(
  'project_apollo_server',
  'sammy',
  'Anna@128#04$2023',
  {
    host: `${process.env.HOST}`,
    dialect: 'mysql',
  },
)
export default sequelize
