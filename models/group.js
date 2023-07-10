const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Group = sequelize.define("group", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  },

  groupname: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Group;
