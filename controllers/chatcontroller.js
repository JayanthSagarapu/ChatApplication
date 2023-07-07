const Chat = require("../models/Chat");

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    await Chat.create({
      message,
      userId: req.user.id,
    });
    res
      .status(200)
      .json({ success: true, username: req.user.username, message: message });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};

module.exports = { sendMessage };
