import express from "express";
import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";

dotenv.config({
  path: "./.env ",
});
const app = express();

const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use("/user", userRoute);
app.use("/chat", chatRoute);

app.use(errorMiddleware)

app.listen(port, () => {
  console.log(`server is listening on ${port} `);
});
