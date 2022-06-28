import { getModelForClass, prop, pre } from "@typegoose/typegoose";
import argon2 from "argon2";
import { IsEmail, MaxLength, MinLength } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";



@pre<User>("save", async function (next) {
  if (this.isModified("password") || this.password) {
    const hash = await argon2.hash(this.password);
    this.password = hash;
    return next();
  }
  return next();
})
@ObjectType()
export class User {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @prop({ required: true })
  name: string;

  @Field(() => String)
  @prop({ required: true , unique: true})
  email: string;

  @prop({ required: true })
  password: string;
}

export const UserModel = getModelForClass(User);

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
