import { env } from "./config/env.js";
import { connectToDatabase } from "./config/database.js";
import app from "./app.js";

async function startServer() {
  try {
    await connectToDatabase();

    app.listen(env.PORT, () => {
      console.log(`app listening port is ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start TaskHubly:", error.message);
    process.exit(1);
  }
}

startServer();
