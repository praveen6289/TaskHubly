import { randomUUID } from "node:crypto";

function requestLogger(req, res, next) {
  const requestId = randomUUID();
  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  const startTime = Date.now();

  res.on("finish", () => {
    console.log(
      `${requestId} | ${new Date().toISOString()} | ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | Duration: ${Date.now() - startTime}ms `,
    );
  });

  next();
}

export default requestLogger;
