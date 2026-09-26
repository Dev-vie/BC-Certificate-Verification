const { Prisma } = require("@prisma/client");

const errorHandler = (err, req, res, next) => {

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        message: `A record with this unique field already exists (${err.meta?.target || "unique constraint"})`,
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({
        message: "Record not found",
      });
    }
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    console.error("[Database Connection Error]", err.message);
    return res.status(503).json({
      message: "Database connection temporarily unavailable. Please try again.",
    });
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error";

  if (status >= 500) {
    console.error("[Unhandled Server Error]", err);
  }

  return res.status(status).json({
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

const notFoundHandler = (req, res) => {
  return res.status(404).json({ message: `Route ${req.originalUrl} not found` });
};

module.exports = { errorHandler, notFoundHandler };
