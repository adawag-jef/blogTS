import e, { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateActiveToken } from "../config/generateToken";
import sendEmail from "../config/sendMail";
import { validateEmail, validPhone } from "../middleware/valid";
import { sendSms } from "../config/sendSMS";

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
};

export default authCtrl;
