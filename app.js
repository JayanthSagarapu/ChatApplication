const express = require("express");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

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
const groupchatRoutes = require("./routes/groupchat");
const groupcontrollerRoutes = require("./routes/groupcontroller");

const User = require("./models/UserDb");
const Chat = require("./models/Chat");
const Group = require("./models/group");
const Usergroup = require("./models/usergroup");

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/group", groupcontrollerRoutes);
app.use("/groupchat", groupchatRoutes);

const http = require("http");
const server = http.createServer(app);

const socketio = require("socket.io");
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("send-message", (message) => {
    console.log("message:", message);
    io.emit("receive", message);
  });

  socket.on("group-message", (message) => {
    console.log("message:", message);
    io.emit("receive", message);
  });
});
app.use((req, res) => {
  console.log("ur;", req.url);
  res.sendFile(path.join(__dirname, `public/${req.url}`));
});

User.hasMany(Chat);
Chat.belongsTo(User);

Group.belongsToMany(User, { through: Usergroup });
User.belongsToMany(Group, { through: Usergroup });

Group.hasMany(Chat);
Chat.belongsTo(Group);

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    // app.listen(3000);
    server.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
