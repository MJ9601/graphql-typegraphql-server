import {
  getModelForClass,
  prop,
  pre,
  ReturnModelType,
  queryMethod,
  index,
} from "@typegoose/typegoose";
import { AsQueryMethod, QueryHelperThis } from "@typegoose/typegoose/lib/types";
import argon2 from "argon2";
import { IsEmail, MaxLength, MinLength } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";

function findByEmail(
  this: ReturnModelType<typeof User, QueryHelpers>,
  email: User["email"]
) {
  return this.findOne({ email });
}
interface QueryHelpers {
  findByEmail: AsQueryMethod<typeof findByEmail>;
}

@pre<User>("save", async function (next) {
  if (this.isModified("password") || this.password) {
    const hash = await argon2.hash(this.password);
    this.password = hash;
    return next();
  }
  return next();
})
@index({ email: 1 })
@queryMethod(findByEmail)
@ObjectType()
export class User {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @prop({ required: true })
  name: string;

  @Field(() => String)
  @prop({ required: true, unique: true })
  email: string;

  @prop({ required: true })
  password: string;
}

export const UserModel = getModelForClass<typeof User, QueryHelpers>(User);

@InputType()
export class CreateUserInput {
  @Field(() => String)
  name: string;

  @IsEmail()
  @Field(() => String)
  email: string;

  @MinLength(6, { message: "Min length of Password is 6 chars" })
  @MaxLength(32, { message: "Max length of password is 32 chars" })
  @Field(() => String)
  password: string;
}

@InputType()
export class LoginInput {
  @IsEmail()
  @Field(() => String)
  email: string;

  @MinLength(6, { message: "Min length of Password is 6 chars" })
  @MaxLength(32, { message: "Max length of password is 32 chars" })
  @Field(() => String)
  password: string;
}
