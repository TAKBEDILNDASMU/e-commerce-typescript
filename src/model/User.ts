import { Document, Schema, model } from "mongoose";

export interface UserInterface extends Document {
  email: string;
  name: string;
  password: string;
  isAdmin: boolean;
}

export interface User {
  email: string;
  name: string;
  password: string;
  isAdmin: boolean;
}

export const UserSchema = new Schema<UserInterface>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

const User = model<UserInterface>("Users", UserSchema);

export default User;
