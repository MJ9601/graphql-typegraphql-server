import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import {
  CreateProductInput,
  GetProductInput,
  ProductModel,
} from "../schema/product.schema";
import { User } from "../schema/user.schema";

class ProductServices {
  async createProduct(input: CreateProductInput & { user: User["_id"] }) {
    return await ProductModel.create(input);
  }

  async findProducts(query: FilterQuery<CreateProductInput> = {}) {
    return ProductModel.find(query).lean();
  }

  async findOneProduct(query: GetProductInput) {
    return ProductModel.findOne(query).lean();
  }

  async findOneProductAndUpdate(
    query: GetProductInput,
    update: UpdateQuery<CreateProductInput>,
    options: QueryOptions = {}
  ) {
    return ProductModel.findOneAndUpdate(query, update, options).lean();
  }
}

export default ProductServices;
