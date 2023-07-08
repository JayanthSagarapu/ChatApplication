const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Chat = sequelize.define("chat", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

  message: {
    type: Sequelize.STRING,
  },

  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Chat;
