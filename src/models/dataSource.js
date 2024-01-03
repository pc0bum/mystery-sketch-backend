const { DataSource } = require("typeorm");
const dotenv = require("dotenv");
dotenv.config();

const appDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  port: process.env.TYPEORM_PORT,
  logging: process.env.TYPEORM_LOGGING === 'TRUE' 
})

appDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error occured during Data Source initialization", err)
    })

module.exports = appDataSource;

