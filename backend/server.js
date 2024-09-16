const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const { Server } = require("socket.io");
const { connectDatabase } = require("./database");
const cookieParser = require("cookie-parser");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// MongoDB Connection
connectDatabase();

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("edit-document", (data) => {
    const { documentId, content } = data;
    socket.broadcast.to(documentId).emit("receive-document", content);
  });

  socket.on("join-document", (documentId) => {
    socket.join(documentId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const documentRouter = require("./routes/document");
const userRouter = require("./routes/user");

app.use("/api/document", documentRouter);
app.use("/api/auth", userRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
