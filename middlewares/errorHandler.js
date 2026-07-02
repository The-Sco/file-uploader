const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  console.error("[ERROR LOG]:", err);
  return res.render("errors/500");
};

export default errorHandler;
