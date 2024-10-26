require('dotenv').config()

module.exports = {
    host: process.env.HOSTDB,
    user: process.env.USERDB,
    password: process.env.PASSWORDDB,
    database: process.env.SHEMADB,
    port: 3306
}