const Chat = require("../models/Chat");
const User = require("../models/UserDb");
const Usergroup = require("../models/usergroup");
const Group = require("../models/group");
const sequelize = require("../util/database");

const sendMessage = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { message, groupname } = req.body;
    const group = await Group.findOne({ groupname });
    const chatDetails = await Chat.create({
      message,
      userId: req.user.id,
      username: req.user.username,
      groupId: group.id,
    });
    res.status(200).json({
      success: true,
      chatDetails,
    });
    await t.commit();
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
    await t.rollback();
  }
};

const getMessages = async (req, res) => {
  try {
    const groupname = req.params.groupname;
    const group = await Group.findOne({ where: { groupname } });
    const chat = await Chat.findAll({ where: { groupId: group.id } });
    res.status(200).json({ chat });
  } catch (err) {
    console.log(err);
    return res.status(500).json("something went wrong");
  }
};

const showallGroups = async (req, res) => {
  try {
    const groups = await Usergroup.findAll({ where: { userId: req.user.id } });
    res.status(201).json({ groups, success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  showallGroups,
};
