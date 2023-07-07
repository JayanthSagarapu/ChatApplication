const Chat = require("../models/Chat");
const User = require("../models/UserDb");
const sequelize = require("../util/database");

const sendMessage = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { message } = req.body;
    await Chat.create(
      {
        message,
        userId: req.user.id,
      },
      { transaction: t }
    );
    res
      .status(200)
      .json({ success: true, username: req.user.username, message: message });
    await t.commit();
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
    await t.rollback();
  }
};

const getMessages = async (req, res) => {
  try {
    const chat = await Chat.findAll({ where: { userId: req.user.id } });
    res.status(200).json({ message: chat });
  } catch (err) {
    console.log(err);
    return res.status(500).json("something went wrong");
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
