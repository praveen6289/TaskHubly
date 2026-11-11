import express from "express";
import taskRoutes from "./routes/taskRoutes.js";
import requestLogger from "./middleware/requestLogger.js";
import errorHandler from "./middleware/errorHandler.js";
import notFoundHandler from "./middleware/notFoundHandler.js";

const app = express();

app.use(requestLogger);
app.use(express.json());

app.get("/api/health", (req, res) => {
  return res
    .status(200)
    .json({ status: "OK", message: "Taskhubly api is running" });
});

app.use("/api/tasks", taskRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
