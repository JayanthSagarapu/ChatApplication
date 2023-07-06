const Sequelize = require("sequelize");

const sequelize = new Sequelize("chat-app", "root", "Pj@8106228817", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
