import mongoose from "mongoose";
import env from "../env";
import { logger } from "./logger";

export const connectToDb = async () => {
  try {
    mongoose.set("strictQuery", true);
    mongoose.set("debug", (collectionName, method, query, doc) => {
      logger.info(`${collectionName}.${method}`, JSON.stringify(query), doc);
    });
    await mongoose.connect(env.MONGO_DB_URI);
    logger.info("Successfully connected to MongoDB atlas");
  } catch (error) {
    console.info(error);
    throw new Error("Can't connect to DB");
  }
};

export const disconnectedFromDb = async () => {
  try {
    await mongoose.disconnect();
    logger.info("Successfully disconnected from MongoDB atlas");
  } catch (error) {
    console.info(error);
    throw new Error("Can't disconnected to DB");
  }
};
