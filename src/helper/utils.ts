import env from "../env";
import { UserInterface } from "../model/User";
import jwt from "jsonwebtoken";

export const generateToken = (user: UserInterface) => {
  return jwt.sign(
    {
      _id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      isAdmin: user.isAdmin,
    },
    env.JWT_SECRET || "somethingsecret",
    {
      expiresIn: "1d",
    }
  );
};
