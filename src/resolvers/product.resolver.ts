import { omit } from "lodash";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import {
  CreateProductInput,
  GetProductInput,
  Product,
  UpdateProduct,
} from "../schema/product.schema";
import { User } from "../schema/user.schema";
import ProductServices from "../service/product.service";
import UserService from "../service/user.service";
import Context from "../types/context.type";

@Resolver()
export default class ProductResolver {
  constructor(
    private productService: ProductServices,
    private userService: UserService
  ) {
    this.productService = new ProductServices();
    this.userService = new UserService();
  }

  @Authorized()
  @Mutation(() => Product)
  async createProduct(
    @Arg("input") input: CreateProductInput,
    @Ctx() context: Context
  ) {
    const user = context.user!;
    const results = await this.productService.createProduct({
      ...input,
      user: user._id,
    });
    const userInfo = await this.userService.findUser(results.user);
    const _userInfo = omit(userInfo, "password");
    // console.log(_userInfo);
    // console.log({ ...results.toJSON(), user: _userInfo });
    return { ...results.toJSON(), user: _userInfo };
    // return results;
  }

  @Authorized()
  @Mutation(() => Product)
  async updateProduct(
    @Arg("input") input: UpdateProduct,
    @Ctx() context: Context
  ) {
    const user = context.user!;

    const product = await this.productService.findOneProduct({
      productId: input.productId,
    });
    if (!product) return null;

    if (product.user !== user._id) return null;

    const results = await this.productService.findOneProductAndUpdate(
      { productId: input.productId },
      { ...omit(input, "productId") },
      { new: true }
    );

    if (!results) return null;

    const userInfo = await this.userService.findUser(
      String(results.user || "")
    );
    const _userInfo = omit(userInfo, "password");
    // console.log(_userInfo);
    // console.log({ ...results.toJSON(), user: _userInfo });
    return { ...results, user: _userInfo };
  }

  @Query(() => Product)
  async product(@Arg("input") input: GetProductInput) {
    const results = await this.productService.findOneProduct(input);
    if (!results) return null;

    const userInfo = await this.userService.findUser(
      String(results.user || "")
    );
    const _userInfo = omit(userInfo, "password");
    // console.log(_userInfo);
    // console.log({ ...results.toJSON(), user: _userInfo });
    return { ...results, user: _userInfo };
  }

  // @Query(() => [Product])
  // async products() {
  //   const results = await this.productService.findProducts();
  //   if (!results) return null;

  //   const userInfo = await this.userService.findUser(
  //     String(results.user || "")
  //   );
  //   const _userInfo = omit(userInfo, "password");
  //   // console.log(_userInfo);
  //   // console.log({ ...results.toJSON(), user: _userInfo });
  //   return { ...results, user: _userInfo };
  // }
}
