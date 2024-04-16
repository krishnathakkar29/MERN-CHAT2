import mongoose from "mongoose";
import jwt from 'jsonwebtoken'

const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "none",
  secure: "true",
};
const connectDB = async () => {
  await mongoose
    .connect(`${process.env.MONGODBURI}/${process.env.DBNAME}`)
    .then((dis) => {
      console.log(`connected ${dis.connection.host}`);
    })
    .catch((err) => {
      throw err;
    });
};

const sendToken = (res, user, code, message) => {
  const token = jwt.sign(
    {
      _id: user._id
    },
    process.env.JWT_SECRET
  )

  return res.status(code).cookie("chat-token", token, cookieOptions).json({
    success: true,
    message,
  });
};

export { connectDB, sendToken, cookieOptions };
