function errorHandler(err, req, res, next) {
  const isProduction = process.env.NODE_ENV === "production";

  if (res.headersSent) {
    return next(err);
  }

  const errorStatus = err.statusCode ?? err.status;

  const statusCode =
    Number.isInteger(errorStatus) && errorStatus >= 400 && errorStatus <= 599
      ? errorStatus
      : 500;

  const message = isProduction
    ? "Internal Server Error"
    : err.message || "Internal Server Error";

  console.error(`[${req.requestId}]`, err);

  return res.status(statusCode).json({
    status: "error",
    message,
  });
}

export default errorHandler;
