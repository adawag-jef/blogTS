import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateActiveToken,
  generateRefreshToken,
} from "../config/generateToken";
import { IDecodedToken, IUser } from "../config/interface";
import sendEmail from "../config/sendMail";
import { sendSms } from "../config/sendSMS";
import { validateEmail, validPhone } from "../middleware/valid";
import User from "../models/userModel";

const CLIENT_URL = process.env.BASE_URL;

const authCtrl = {
  register: async (req: Request, res: Response) => {
    try {
      const { name, account, password } = req.body;

      // chec if user already registered
      const user = await User.findOne({ account });

      if (user) {
        return res.status(400).json({ msg: "Email or Phone already exists." });
      }

      // hash Password
      const passwordHash = await bcrypt.hash(password, 12);

      // create new User
      const newUser = {
        name,
        account,
        password: passwordHash,
      };

      const active_token = generateActiveToken({ newUser });

      if (validateEmail(account)) {
        const url = `${CLIENT_URL}/active/${active_token}`;
        sendEmail(account, url, "Verify your email address");
        res.json({ msg: "Success Please check your email." });
      } else if (validPhone(account)) {
        const url = `${CLIENT_URL}/active/${active_token}`;

        sendSms(account, url, "Verify your phone number.");
        res.json({ msg: "Success Please check your phone." });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  activeAccount: async (req: Request, res: Response) => {
    try {
      const { active_token } = req.body;

      const decoded = <IDecodedToken>(
        jwt.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`)
      );

      const { newUser } = decoded;

      if (!newUser) {
        return res.status(400).json({ msg: "Invalid authentication." });
      }

      const user = new User(newUser);

      await user.save();
      res.json({ msg: "Account has been activated" });
    } catch (err) {
      let errMsg = err.message;
      if (err.code === 11000) {
        errMsg = Object.keys(err.keyValue)[0] + " already exists.";
      } else {
        let name = Object.keys(err.errors)[0];
        errMsg = err.errors[`${name}`].message;
      }
      return res.status(500).json({ msg: errMsg });
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const { account, password } = req.body;

      const user = await User.findOne({ account });

      if (!user) {
        return res.status(400).json({ msg: "This account does not exists" });
      }

      loginUser(user, password, res);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req: Request, res: Response) => {
    try {
      res.clearCookie("refreshToken", { path: "/api/refresh_token" });
      return res.json({ msg: "Logged Out" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshToken: async (req: Request, res: Response) => {
    try {
      const rf_token = req.cookies.refreshToken;
      if (!rf_token) {
        return res.status(400).json({ msg: "Please login now" });
      }
      const decoded = <IDecodedToken>(
        jwt.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`)
      );
      if (!decoded.id) {
        return res.status(400).json({ msg: "Please login now" });
      }

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(400).json({ msg: "This account does not exists." });
      }

      const access_token = generateAccessToken({ id: user._id });

      res.json({ access_token });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const loginUser = async (user: IUser, password: string, res: Response) => {
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(500).json({ msg: "Password is incorrect" });
  }

  const access_token = generateAccessToken({ id: user._id });
  const refresh_token = generateRefreshToken({ id: user._id });

  res.cookie("refreshToken", refresh_token, {
    httpOnly: true,
    path: "/api/refresh_token",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.json({
    msg: "Login Success",
    access_token,
    user: { ...user._doc, password: "" },
  });
};

export default authCtrl;
