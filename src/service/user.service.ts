import { CreateUserInput, LoginInput, UserModel } from "../schema/user.schema";
import Context from "../types/context.type";

class UserService {
  async login(input: LoginInput, context: Context) {
    const user = await UserModel.findOne({ email: input.email });
    if (!user) return null;
  }
  async createUser(input: CreateUserInput) {
    return UserModel.create(input);
  }
}

export default UserService;
