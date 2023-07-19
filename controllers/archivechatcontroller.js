const archiveChat = require("../models/archivechat");
const CronJob = require("cron").CronJob;
const Chat = require("../models/Chat");

const job = new CronJob(
  "0 59 23 * * *",
  async function () {
    const t = await sequelize.transaction();

    try {
      const data = await Chat.findAll();
      data.forEach(async (element) => {
        await archiveChat.create(
          {
            message: element.msg,
            name: element.username,
            userId: element.userId,
            groupId: element.groupId,
          },
          { transaction: t }
        );
      });
      await Chat.destroy({ where: {} }, { transaction: t });
      await t.commit();
    } catch (err) {
      await t.rollback();

      console.log(err);
    }
  },
  null,
  true
);
module.exports = {
  job,
};
