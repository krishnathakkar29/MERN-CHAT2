import express from "express";
import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";
import adminRoute from "./routes/admin.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { corsOptions } from "./constants/config.js";
import cors from "cors";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import { v4 as uuid } from "uuid";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";

dotenv.config({
  path: "./.env ",
});

const app = express();
const server = createServer(app);
const io = new Server(server, {
  corsOptions,
});

const port = process.env.PORT || 3000;
const adminSecretKey = process.env.ADMIN_SECRET_KEY || "adsasdsdfsdfsdfd";
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";
const userSocketIDs = new Map();

connectDB();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use("/admin", adminRoute);

io.on("connection", (socket) => {
  const user = {
    _id: "userId",
    name: "userName",
  };
  userSocketIDs.set(user._id.toString(), socket.id);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDB = {
      content: message,
      sender: user._id,
      chatId,
    };

    const membersSockets = getSockets(members);

    io.to(membersSockets).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });

    io.to(membersSockets).emit(NEW_MESSAGE_ALERT, { chatId });

    try {
      await Message.create(messageForDB)
    } catch (error) {
      console.log("DB MESSAGE SOCKET...", error)
    }
  });

  socket.on("disconnect", () => {
    userSocketIDs.delete(user._id.toString());
    console.log("User Disconnected");
  });
});

app.use(errorMiddleware);

server.listen(port, () => {
  console.log(
    `server is listening on ${port} in ${process.env.NODE_ENV} mode `
  );
});

export { adminSecretKey, envMode, userSocketIDs };
