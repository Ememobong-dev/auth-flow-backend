import mongoose from "mongoose";
import { env } from "./env.js";
import { DB_NAME } from "./../constants/index.js";

export const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(env.MONGODB_URI, {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 10000,
    });
    console.log(
      `MongoDb Connected successfully: ${connection.connection.host} \n ${connection.connection.name}`,
    );

    return connection;
  } catch (error) {
    console.error(`MongoDb failed to connect successfully: ${error.message}`);
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
