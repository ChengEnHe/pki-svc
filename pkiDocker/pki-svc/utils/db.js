const Sequelize = require('sequelize')
// const dotEnv = require('dotenv').config({path : __dirname + '/.env'})
const env = process.env
/*
var sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql',
  
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  
    // SQLite only
    storage: 'path/to/database.sqlite'
  });
*/
  // Or you can simply use a connection uri
console.log('DB_URL:' + env.DB_URL)
let sequelize = new Sequelize(env.DB_URL)
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })
module.exports = sequelize
