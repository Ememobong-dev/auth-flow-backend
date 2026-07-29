import express from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/env.js";
import cookieParser from "cookie-parser";
import { apiRouter } from "./routes/index.js";
import { API_PREFIX } from "./constants/index.js";
import { notFoundHandler } from './middlewares/not-found.middleware.js';
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  }),
);
app.use(API_PREFIX, apiRouter);
app.use(notFoundHandler);
app.use(errorHandler)

export { app }