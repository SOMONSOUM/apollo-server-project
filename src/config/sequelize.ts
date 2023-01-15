import { Sequelize } from 'sequelize'
import { config } from 'dotenv'

config()
const sequelize = new Sequelize(
  `mysql://sammy:Anna@128#04$2023@rakphen24.com/project_apollo_server`,
  {
    host: `${process.env.HOST}`,
    dialect: 'mysql',
  },
)
export default sequelize
