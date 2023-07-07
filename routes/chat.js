const express = require("express");

const router = express.Router();

const chatController = require("../controllers/chatcontroller");
const middleware = require("../middleware/auth");

router.post(
  "/sendmessage",
  middleware.authenticate,
  chatController.sendMessage
);

router.get("/getmessages", middleware.authenticate, chatController.getMessages);

module.exports = router;
