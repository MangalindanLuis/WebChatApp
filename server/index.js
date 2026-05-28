const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// STORE USERS
let users = [];

io.on("connection", (socket) => {

  console.log("Connected:", socket.id);

  // ================= REGISTER =================
  socket.on("register", (username) => {

    users = users.filter(
      (u) => u.socketId !== socket.id
    );

    users.push({
      username,
      socketId: socket.id,
    });

    io.emit("users", users);
  });

  // ================= PRIVATE MESSAGE =================
  socket.on(
    "private_message",
    ({ to, from, message }) => {

      io.to(to).emit(
        "receive_private_message",
        {
          from,
          message,
        }
      );
    }
  );

  // ================= TYPING =================
  socket.on("typing", ({ to, from }) => {

    io.to(to).emit("user_typing", {
      from,
    });
  });

  // ================= STOP TYPING =================
  socket.on(
    "stop_typing",
    ({ to, from }) => {

      io.to(to).emit(
        "user_stop_typing",
        {
          from,
        }
      );
    }
  );

  // ================= SEEN SYSTEM =================
  socket.on(
    "message_seen",
    ({ to, from }) => {

      io.to(to).emit(
        "messages_seen",
        {
          from,
        }
      );
    }
  );

  // ================= DISCONNECT =================
  socket.on("disconnect", () => {

    users = users.filter(
      (u) => u.socketId !== socket.id
    );

    io.emit("users", users);

    console.log(
      "Disconnected:",
      socket.id
    );
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});