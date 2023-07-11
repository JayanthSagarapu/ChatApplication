const Chat = require("../models/Chat");
const User = require("../models/UserDb");
const Usergroup = require("../models/usergroup");
const Group = require("../models/group");
const sequelize = require("../util/database");

const sendMessage = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { message, groupname } = req.body;
    const group = await Group.findOne({ where: { groupname } });
    const chatDetails = await Chat.create(
      {
        message,
        userId: req.user.id,
        username: req.user.username,
        groupId: group.id,
      },
      { transaction: t }
    );
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
    const usergroup = await Usergroup.findAll({
      where: { userId: req.user.id, groupId: group.id },
    });
    res.status(200).json({ chat, usergroup });
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

const showfriends = async (req, res) => {
  try {
    const groupname = req.params.groupname;
    const group = await Group.findOne({ where: { groupname } });
    const usergroup = await Usergroup.findAll({
      where: { userId: req.user.id, groupId: group.id },
    });

    const friends = await Usergroup.findAll({ where: { groupId: group.id } });
    res.status(201).json({ friends, usergroup, success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

const removefriend = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { friendId, groupname } = req.params;
    const group = await Group.findOne({ where: { groupname } });
    const friend = await Usergroup.findOne({
      where: { groupId: group.id, userId: friendId },
    });

    if (friend) {
      await friend.destroy();
      await t.commit();
      res.status(200).json({
        message: "Successfully deleted friend",
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Delete friend problem" });
    await t.rollback();
  }
};

const adminfriend = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { friendId, groupname } = req.body;
    const group = await Group.findOne({ where: { groupname } });

    const admin = await Usergroup.update(
      { isAdmin: true },
      { where: { userId: friendId, groupId: group.id } },
      { transaction: t }
    );

    await t.commit();
    res.status(200).json({
      message: `${admin.name} is Successfully made admin`,
    });
  } catch (err) {
    res.status(500).json({ message: "admin friend problem" });
    await t.rollback();
  }
};

module.exports = {
  sendMessage,
  getMessages,
  showallGroups,
  showfriends,
  removefriend,
  adminfriend,
};
