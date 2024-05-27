const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BreezedUser = sequelize.define(
  "BreezedUser",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_verification_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    logins: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    api_calls: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    subscribed_monthly: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    subscribed_lifetime: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    time_created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    time_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "breezed_user",
  }
);

module.exports = BreezedUser;
