import { getModelForClass, index, prop, Ref } from "@typegoose/typegoose";
import { Field, InputType, ObjectType } from "type-graphql";
import { User } from "./user.schema";
import { customAlphabet } from "nanoid";
import { IsNumber, Min } from "class-validator";

const nanoid = customAlphabet(
  "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890",
  10
);

@index({ productId: 1 })
@ObjectType()
export class Product {
  @Field(() => String)
  _id: string;

  @Field(() => User)
  @prop({ required: true, ref: () => User })
  user: Ref<User>;

  @Field(() => String)
  @prop({ required: true })
  name: string;

  @Field(() => String)
  @prop({ required: true })
  description: string;

  @Field(() => String)
  @prop({ required: true })
  price: string;

  @Field(() => String)
  @prop({ required: true, default: () => `p_${nanoid()}`, unique: true })
  productId: string;
}

export const ProductModel = getModelForClass<typeof Product>(Product);

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @IsNumber()
  @Min(1)
  @Field()
  price: number;

  @Field()
  description: string;

  // @Field(() => String)
  // name: string;
}

@InputType()
export class UpdateProduct {
  @Field()
  productId: string;

  @Field()
  name: string;

  @Field()
  price: number;

  @Field()
  description: string;
}

@InputType()
export class GetProductInput {
  @Field()
  productId: string;
}
