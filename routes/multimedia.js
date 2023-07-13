const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer();

const middleware = require("../middleware/auth");
const multimediaController = require("../controllers/multimediaController");

router.post(
  "/sendfile/:groupname",
  middleware.authenticate,
  upload.single("file"),
  multimediaController.sendFile
);

module.exports = router;
