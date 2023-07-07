const jwt = require("jsonwebtoken");

const User = require("../models/UserDb");

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const jwttoken = jwt.verify(token, "jayanthsecretkey");
    const user = await User.findByPk(jwttoken.userId);

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false });
  }
};

module.exports = { authenticate };
