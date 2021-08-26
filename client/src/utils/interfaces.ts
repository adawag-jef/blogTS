import React from "react";

export interface IParams {
  page: string;
  slug: string;
}

export type InputChange = React.ChangeEvent<HTMLInputElement>;
export type FormSubmit = React.FormEvent<HTMLFormElement>;

export interface IUserLogin {
  account: string;
  password: string;
}

export interface IUser {
  account: string;
  avatar: string;
  createdAt: string;
  name: string;
  role: string;
  type: string;
  updatedAt: string;
  _id: string;
}
