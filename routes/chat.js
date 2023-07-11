const express = require("express");

const router = express.Router();

const chatController = require("../controllers/chatcontroller");
const middleware = require("../middleware/auth");

router.get(
  "/showall-groups",
  middleware.authenticate,
  chatController.showallGroups
);

module.exports = router;
