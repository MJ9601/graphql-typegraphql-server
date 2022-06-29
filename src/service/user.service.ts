import { ApolloError } from "apollo-server";
import argon2 from "argon2";
import { omit } from "lodash";
import { CreateUserInput, LoginInput, UserModel } from "../schema/user.schema";
import Context from "../types/context.type";
import { signJwt } from "../utils/jwt.utils";

class UserService {
  async findUser(user: string) {
    return await UserModel.findById(user).lean();
  }
  async login(input: LoginInput, context: Context) {
    const user = await UserModel.find().findByEmail(input.email).lean();
    if (!user) throw new ApolloError("Invalid email or password");

    const verifyPass = await argon2.verify(user.password, input.password);

    if (!verifyPass) throw new ApolloError("Invalid email or password");

    const token = signJwt(omit(user, "password"));

    context.res.cookie("accessToken", token, {
      httpOnly: true,
      maxAge: 3.154e10,
      domain: "localhost",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return token;
  }
  async createUser(input: CreateUserInput) {
    return UserModel.create(input);
  }
}

export default UserService;
