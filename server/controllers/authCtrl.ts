import e, { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
      const newUser = new User({
        name,
        account,
        password: passwordHash,
      });

      res.json({ stutus: "OK", msg: "Register successfully", data: newUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

export default authCtrl;
