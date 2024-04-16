import { TryCatch } from "../middlewares/error.js";
import { User } from "../models/user.js";
import { Chat } from "../models/chat.js";
import { cookieOptions, sendToken } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import bcrypt from "bcrypt";

const newUser = TryCatch(async (req, res, next) => {
  const { username, bio, name, password } = req.body;
  const avatar = {
    public_id: "public_id",
    url: "url",
  };

  const user = await User.create({
    name,
    bio,
    username,
    password,
    avatar,
  });

  sendToken(res, user, 201, "User created");
});

const login = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");

  if (!user) return next(new ErrorHandler("Invalid Username", 404));

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new ErrorHandler("Invalid Password", 404));
  }

  sendToken(res, user, 200, `Welcome Back ${user.name}`);
});

const getMyProfile = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);
  return res.status(200).json({
    success: true,
    user,
  });
});

const logout = TryCatch(async (req, res, next) => {
  return res
    .status(200)
    .cookie("chat-token", "", {
      ...cookieOptions,
      maxAge: 0,
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

const searchUser = TryCatch(async (req, res, next) => {
  const { name } = req.query;
  const chat = Chat;

  return res.status(200).json({
    success: true,
    message: name,
  });
});

export { newUser, login, getMyProfile, logout, searchUser };
