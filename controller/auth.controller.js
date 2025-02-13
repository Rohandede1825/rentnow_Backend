import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

import { Error } from "mongoose";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashPsw = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashPsw });

  try {
    await newUser.save();
    res.status(201).json("user created successfully");
  } catch (err) {
    next(err);
  }
};
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const valid_user = await User.findOne({ email });

    if (!valid_user) {
      return next(errorHandler(404, "user not found"));
    }

    const isMatch = await bcrypt.compare(password, valid_user.password);

    if (!isMatch) {
      return next(errorHandler(401, "invalid credentials")).Error;
    }

    const token = jwt.sign({ id: valid_user._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = valid_user._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (err) {
    next(err);
  }
};
