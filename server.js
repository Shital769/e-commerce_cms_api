import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();
const PORT = process.env.PORT || 8000;

//connect to database
import { connectDB } from "./src/config/dbConfig.js";
connectDB();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//API routers
import adminRouter from "./src/routers/AdminRouter.js";
import categoryRouter from "./src/routers/categoryRouter.js";
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/category", categoryRouter);

//root url  request
app.use("/", (req, res, next) => {
  const error = {
    message: "You dont have permisssion here",
  };
  next(error);
});

//global error handler

app.use((error, req, res, next) => {
  console.log(error);
  const statusCode = error.errorCode || 404;
  res.status(statusCode).json({
    status: "error",
    message: error.message,
  });
});

//run the server

app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`server is running at http://localhost:${PORT}`);
});
