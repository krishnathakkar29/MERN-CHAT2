import express from "express";
import {
  searchUser,
  getMyProfile,
  login,
  logout,
  newUser,
} from "../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app = express.Router();

app.post("/new", singleAvatar, newUser);
app.post("/login", login);

//authenticated routes
app.use(isAuthenticated);
app.get("/me", getMyProfile);
app.get("/logout", logout);
app.get("/search", searchUser);

export default app;
