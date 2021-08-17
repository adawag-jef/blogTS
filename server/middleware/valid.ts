import { Request, Response, NextFunction } from "express";

export const validRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, account, password } = req.body;
  const errors = [];

  //name is required
  if (!name) {
    errors.push("Please add your name.");
  }
  //max length
  else if (name.length > 20) {
    errors.push("Your name is up to 20 chars long.");
  }

  //email or phone number is required
  if (!account) {
    errors.push("Please add your email or phone number.");
  }
  //validate email or phone number format
  else if (!validPhone(account) && !validateEmail(account)) {
    errors.push("Email or phone number format is incorrect.");
  }

  //min of 6 characters
  if (password.length < 6) {
    errors.push("Password must be atleast 4 characters.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ msg: errors });
  }
  next();
};

export function validPhone(phone: string) {
  const re = /^[+]/g;
  return re.test(phone);
}

export function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
