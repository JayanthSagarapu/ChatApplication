const Sequelize = require("sequelize");

const sequelize = new Sequelize("chat-app", "jayanth", "Pj8106228817", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
