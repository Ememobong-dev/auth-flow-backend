import mongoose from "mongoose";
import { env } from "./env.js";
import { DB_NAME } from "./../constants/index";

export const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(env.MONGODB_URI, {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 10000,
    });
    console.log(
      `MongoDb Connected successfully: ${connection.connection.host} ${connection.connection.host}`,
    );

    return connection;
  } catch (error) {
    console.error(`MongoDb failed to connect successfully: ${error}`);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log(
      `MongoDb Disconnected`,
    );
  }
};
