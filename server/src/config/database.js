import { MongoClient } from "mongodb";
import { env } from "./env.js";

const client = new MongoClient(env.MONGODB_URI);

let database;

export async function connectToDatabase() {
  await client.connect();

  database = client.db();

  await database.command({ ping: 1 });

  console.log("MongoDB connected successfully");

  return database;
}

export function getDatabase() {
  if (!database) {
    throw new Error("Database is not connected");
  }

  return database;
}
