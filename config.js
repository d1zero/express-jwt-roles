require("dotenv").config();

module.exports = {
    secret: process.env.SECRET_KEY,
    port: process.env.PORT
}