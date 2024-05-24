import { generateToken } from "../helper/utils";
import { UserInterface } from "./User";

export type createUserRequest = {
  name: string;
  email: string;
  password: string;
};

export type userResponse = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token?: string;
};

export type loginRequest = {
  email: string;
  password: string;
};

export type updateRequest = {
  name: string;
  password: string;
};

export const toUserResponse = (user: UserInterface): userResponse => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  };
};

export const toUserLoginResponse = (user: UserInterface): userResponse => {
  const response = toUserResponse(user);
  return {
    ...response,
    token: generateToken(user),
  };
};
