const Group = require("../models/group");
const Usergroup = require("../models/usergroup");
const User = require("../models/UserDb");
const sequelize = require("../util/database");

const createGroup = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { groupname } = req.body;
    const creategroup = await Group.create({ groupname }, { transaction: t });
    const usergroup = await Usergroup.create(
      {
        groupname,
        name: req.user.username,
        isAdmin: true,
        groupId: creategroup.id,
        userId: req.user.id,
      },
      { transaction: t }
    );
    res.status(200).json({
      creategroup,
      success: true,
      message: "group successfully created",
    });
    t.commit();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
    t.rollback();
  }
};

const addFriend = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { email, groupname } = req.body;
    const member = await User.findOne({ where: { email } });
    const group = await Group.findOne({ where: { groupname } });
    const usergroup = await Usergroup.create({
      groupname,
      name: member.username,
      groupId: group.id,
      userId: member.id,
    });

    res.status(201).json({
      success: true,
      message: "member added onto this group successfully",
    });
    t.commit();
  } catch (err) {
    console.log(err);
    t.rollback();
    res.status(500).json({ error: err });
  }
};

module.exports = {
  createGroup,
  addFriend,
};
