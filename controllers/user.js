const User = require("../models/UserDb");
const sequelize = require("../util/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { username, email, phone, password } = req.body;

    const saltrounds = 10;
    bcrypt.hash(password, saltrounds, async (err, hash) => {
      const user = await User.create(
        {
          username,
          email,
          phone,
          password: hash,
        },
        { transaction: t }
      );
      res.status(200).json({
        message: "SuccessFully Created new user",
      });
      await t.commit();
    });
  } catch (err) {
    res.status(500).json(err);
    await t.rollback();
  }
};

const generateAccessToken = (id, username) => {
  return jwt.sign({ userId: id, username: username }, "jayanthsecretkey");
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const founduser = await User.findOne({ where: { email } });

    if (founduser) {
      bcrypt.compare(password, founduser.password, (err, result) => {
        if (result) {
          res.status(200).json({
            message: "Successfullt Logged in",
            success: true,
            token: generateAccessToken(founduser.id, founduser.username),
          });
        } else {
          res
            .status(401)
            .json({ success: false, message: "Password is wrong" });
        }
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  signUp,
  login,
};
