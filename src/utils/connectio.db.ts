import config from "config";
import mongoose from "mongoose";

const connectToDB = async () => {
  const uri = config.get<string>("mongoUri");
  try {
    await mongoose.connect(uri);
    console.log("connected to db ...");
  } catch (err: any) {
    console.error("Couldn't connect to db");
    process.exit(1);
  }
};

export default connectToDB;
