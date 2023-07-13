const sequelize = require("../util/database");
const Chat = require("../models/Chat");
const Group = require("../models/group");
const S3services = require("../services/S3services");

const sendFile = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const groupname = req.params.groupname;
    const group = await Group.findOne({ where: { groupname } });

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: `Please choose file !` });
    }

    let type = req.file.mimetype.split("/")[1];

    const file = req.file.buffer;
    //  console.log("file>>>>>>>>>>>>", file);

    const filename = `GroupChat/${new Date()}.${type}`;
    //  console.log("filename>>>>>>>>>>>>", filename);

    const fileUrl = await S3services.uploadToS3(file, filename);
    // console.log("fileUrl>>>>>>>>>>>>>>", fileUrl)

    let chat = await Chat.create({
      message: `${fileUrl}`,
      username: req.user.username,
      userId: req.user.id,
      groupId: group.id,
    });

    await t.commit();
    res
      .status(201)
      .json({ message: "data send succesfully", username: req.user.name });
  } catch (err) {
    console.log(err);
    await t.rollback();
    res.status(500).json(err);
  }
};

module.exports = {
  sendFile,
};
