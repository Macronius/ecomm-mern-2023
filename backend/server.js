// built-in node modules
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import connectDB from "./config/db.js";
// routes
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
// error handling
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
//

const port = process.env.PORT || 5000;

// CONNECT TO DATABASE
connectDB();

// INITIALIZE THE APP
const app = express();

// MIDDLEWARES
// body parser - for raw json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cookie parser - allows access to req.cookie
app.use(cookieParser());

// product routes  // Q-20
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

// create a route on server for paypal to get client id safely
app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

// set root 'uploads' folder as a static folder
const __dirname = path.resolve();  // set __dirname to current directory
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// PROUDUCTION CHECK
// DEP-01
if (process.env.NODE_ENVIRONMENT === "production") {
  // set react build folder (from npm run build) to be a static folder
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  // redirect any path that is not /api to index.html ( load: frontend[] > build[] > index.html )
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  // if not in production, the using react dev server
  // set root 'uploads' folder as a static folder
  // const __dirname = path.resolve(); // set __dirname to current directory
  // app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// error handling
app.use(notFound);
app.use(errorHandler);

// START THE SERVER
app.listen(port, () => console.log(`Server is running in ${process.env.NODE_ENVIRONMENT} mode on port ${port}`));
