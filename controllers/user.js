const { has } = require("lodash");
const User = require("../models/UserDb");
const sequelize = require("../util/database");
const bcrypt = require("bcrypt");

const addUser = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    const saltrounds = 10;
    bcrypt.hash(password, saltrounds, async (err, hash) => {
      const user = await User.create({
        username,
        email,
        phone,
        password: hash,
      });
      res.status(200).json({
        message: "SuccessFully Created new user",
      });
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  addUser,
};
