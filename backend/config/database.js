require("dotenv").config();
const { Sequelize } = require("sequelize");

console.log("************************************");
console.log(process.env.DATABASE_URI);
console.log("************************************");

const sequelize = new Sequelize({
  dialect: "postgres",
  logging: true,
  ssl: process.env.DATABASE_SSL,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});

module.exports = sequelize;
