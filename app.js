const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require('hpp')
const userRouter = require("./src/routes/userRoutes");
const PostRouter = require("./src/routes/postRoutes");
const ReportRouter = require("./src/routes/reportRoutes");

const AppError = require("./util/appError");
const globalErrorHandler = require("./src/controllers/errorController");
const app = express();
const cors = require('cors');
app.use(cors())

// 1) MIDDLEWARES

if (process.env.NODE_ENV === "development")
{
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, 
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use(helmet());
app.use(limiter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp({}));
app.use(express.static("/"));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", PostRouter);
app.use("/api/v1/reports", ReportRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

// 4) GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

module.exports = app;
