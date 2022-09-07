require('dotenv').config()
const mysql = require('mysql')

const connection = mysql.createPool({
    host : process.env.db_host,
    user : process.env.db_user,
    password : process.env.db_password,
    database : process.env.db_database,
    port : process.env.db_port,

    multipleStatements: true,
    connectionLimit :10
})

module.exports = connection