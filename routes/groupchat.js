const express = require("express");
const router = express.Router();

const Groupchat = require("../controllers/groupchat");
const middleware = require("../middleware/auth");

router.post(
  "/sendmessage/:groupname",
  middleware.authenticate,
  Groupchat.sendMessage
);

router.get(
  "/getmessages/:groupname",
  middleware.authenticate,
  Groupchat.getMessages
);

router.get("/showall-groups", middleware.authenticate, Groupchat.showallGroups);

router.get(
  "/friends/:groupname",
  middleware.authenticate,
  Groupchat.showfriends
);

router.delete("/deletefriend/:friendId/:groupname", Groupchat.removefriend);

router.post("/adminfriend", Groupchat.adminfriend);

router.post("/rmvadmin", Groupchat.rmvadmin);

module.exports = router;
