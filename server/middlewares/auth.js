import { adminSecretKey } from "../app.js";
import { ErrorHandler } from "../utils/utility.js";
import { TryCatch } from "./error.js";
import jwt, { decode } from "jsonwebtoken";

const isAuthenticated = TryCatch(async (req, res, next) => {
  const token = req.cookies["chat-token"];

  if (!token)
    return next(new ErrorHandler("Please login to access this route", 401));

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  console.log(decodedToken);

  req.user = decodedToken._id;

  next();
});

const adminOnly = (req, res, next) => {
  const token = req.cookies["chat-admin-token"];

  if (!token)
    return next(new ErrorHandler("Only Admin can access this route", 401));

  const secretKey = jwt.verify(token, process.env.JWT_SECRET);

  const isMatched = secretKey === adminSecretKey;

  if (!isMatched)
    return next(new ErrorHandler("Only Admin can access this route", 401));

  next();
};

export { isAuthenticated, adminOnly };
