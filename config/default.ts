export default {
  port: process.env.PORT || "8080",
  mongoUri:
    process.env.MONGODB_URI || "mongodb://localhost:27017/typegraphql-test",
  privateKey: process.env.PRIVATE_KEY,
  publicKey: process.env.PUBLIC_KEY,
};
