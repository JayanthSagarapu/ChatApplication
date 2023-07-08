const express = require("express");
const app = express();

const cors = require("cors");
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: "GET, POST, PUT, DELETE",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sequelize = require("./util/database");

const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");

const User = require("./models/UserDb");
const Chat = require("./models/Chat");

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);

User.hasMany(Chat);
Chat.belongsTo(User);

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
