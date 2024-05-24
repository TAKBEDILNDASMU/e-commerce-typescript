import { Request } from "express";
import { UserInterface } from "../model/User";

export interface UserRequest extends Request {
  user?: UserInterface;
}
