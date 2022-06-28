import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { buildSchema } from "type-graphql";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import config from "config";
import { resolvers } from "./resolvers/index.resolver";
import connectToDB from "./utils/connectio.db";
import Context from "./types/context.type";
import { verifyJwt } from "./utils/jwt.utils";
import { User } from "./schema/user.schema";

const bootstrap = async () => {
  const schema = await buildSchema({
    resolvers,
    // authChecker,
  });

  const app = express();
  app.use(cookieParser());

  const server = new ApolloServer({
    schema,
    context: (ctx: Context) => {
      if (ctx.req.cookies.accessToken)
        ctx.user = verifyJwt<User>(ctx.req.cookies.accessToken);

      return ctx;
    },
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  await server.start();

  server.applyMiddleware({ app });

  const port = config.get<number>("port");

  app.listen({ port }, () => {
    console.log(`Server is running on PORT ${port}`);
  });

  await connectToDB();
};

bootstrap();
