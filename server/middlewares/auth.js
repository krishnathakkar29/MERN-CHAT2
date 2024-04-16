import { ErrorHandler } from "../utils/utility.js";
import { TryCatch } from "./error.js";
import jwt, { decode } from 'jsonwebtoken'

const isAuthenticated = TryCatch(async (req, res, next) => {
  const token = req.cookies["chat-token"];

  if (!token)
    return next(new ErrorHandler("Please login to access this route", 401));

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    console.log(decodedToken)

    req.user = decodedToken._id

  next();
});

export { isAuthenticated };
