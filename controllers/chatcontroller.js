const Usergroup = require("../models/usergroup");

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
  showallGroups,
};
