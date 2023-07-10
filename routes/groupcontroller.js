const express = require("express");

const router = express.Router();

const GroupController = require("../controllers/groupcontroller");
const middleware = require("../middleware/auth");

router.post(
  "/creategroup",
  middleware.authenticate,
  GroupController.createGroup
);

router.post("/addfriend", middleware.authenticate, GroupController.addFriend);

module.exports = router;
