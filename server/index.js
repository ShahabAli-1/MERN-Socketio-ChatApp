const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const messagesRoutes = require("./routes/messagesRoutes");
const socket = require("socket.io");
require("dotenv").config();
const app = express();

app.use(cors());
app.get("/", (req, res) => {
  return res.json({ msg: "|Helloo" });
});
app.use(express.json());
app.use("/api/auth", userRoutes);
app.use("/api/message", messagesRoutes);

const connecttoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGOURL);
    console.log("Connected to DB");
  } catch (error) {
    console.log(error.message);
  }
};

connecttoDb();

const server = app.listen(process.env.PORT, () =>
  console.log("server running on port 5000")
);

const io = socket(server, {
  cors: {
    origin: "https://mern-socketio-chat-app-ie75.vercel.app/",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});
