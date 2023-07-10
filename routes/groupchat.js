const express = require("express");
const router = express.Router();

const Groupchat = require("../controllers/groupchat");
const middleware = require("../middleware/auth");

router.post("/sendmessage", middleware.authenticate, Groupchat.sendMessage);

router.get(
  "/getmessages/:groupname",
  middleware.authenticate,
  Groupchat.getMessages
);

router.get("/showall-groups", middleware.authenticate, Groupchat.showallGroups);

module.exports = router;
