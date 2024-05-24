import User, { UserInterface } from "../model/User";
import {
  createUserRequest,
  loginRequest,
  toUserLoginResponse,
  toUserResponse,
  updateRequest,
  userResponse,
} from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import { ResponseError } from "../error/response-error";
import bcrypt from "bcrypt";

export class UserService {
  public static async register(request: createUserRequest): Promise<userResponse> {
    const registerRequest = Validation.validate(UserValidation.REGISTER, request);

    const totalUserWithSameEmail = await User.find({
      email: registerRequest.email,
    });

    // if the email is not found, return error
    if (totalUserWithSameEmail.length != 0) {
      throw new ResponseError(401, "Email already exist, please use another email!");
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await User.create({
      email: registerRequest.email,
      name: registerRequest.name,
      password: registerRequest.password,
    });

    return toUserResponse(user);
  }

  public static async login(request: loginRequest): Promise<userResponse> {
    const loginRequest = Validation.validate(UserValidation.LOGIN, request);

    const user = await User.findOne({
      email: loginRequest.email,
    });

    if (!user) {
      throw new ResponseError(401, "Email or password incorrect!");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

    if (!isPasswordValid) {
      throw new ResponseError(401, "Email or password incorrect!");
    }

    return toUserLoginResponse(user);
  }

  public static async get(user: UserInterface): Promise<userResponse> {
    return toUserResponse(user);
  }

  public static async update(user: UserInterface, request: updateRequest): Promise<userResponse> {
    const updateRequest = Validation.validate(UserValidation.UPDATE, request);

    if (updateRequest.name) {
      user.name = updateRequest.name;
    }

    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const result = await User.findOneAndUpdate(
      {
        email: user.email,
      },
      user,
      {
        new: true,
      }
    );

    if (!result) {
      throw new ResponseError(401, "Unauthorized");
    }

    return toUserResponse(result);
  }
}
