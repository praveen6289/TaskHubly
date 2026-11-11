import dotenv from "dotenv";

dotenv.config();

const rawPort = process.env.PORT;

if (rawPort !== undefined && rawPort.trim() === "") {
  throw new Error("PORT cannot be empty");
}

const port = rawPort === undefined ? 3000 : Number(rawPort);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid port number");
}

const rawNodeEnv = process.env.NODE_ENV;

const nodeEnv = rawNodeEnv === undefined ? "development" : rawNodeEnv.trim();

const allowedEnvironments = ["development", "production", "test"];

if (!allowedEnvironments.includes(nodeEnv)) {
  throw new Error(`NODE_ENV must be one of: ${allowedEnvironments.join(", ")}`);
}

const rawMongoUri = process.env.MONGODB_URI;

if (!rawMongoUri || rawMongoUri.trim() === "") {
  throw new Error("MONGODB_URI is required");
}

if (
  !rawMongoUri.startsWith("mongodb://") &&
  !rawMongoUri.startsWith("mongodb+srv://")
) {
  throw new Error("MONGODB_URI must be a valid MongoDB connection URI");
}

export const env = {
  PORT: port,
  NODE_ENV: nodeEnv,
  MONGODB_URI: rawMongoUri.trim(),
};
