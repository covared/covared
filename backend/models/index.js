const sequelize = require("../config/database");
const BreezedUser = require("./breezedUser");

const db = {
  sequelize,
  BreezedUser,
};

module.exports = db;
