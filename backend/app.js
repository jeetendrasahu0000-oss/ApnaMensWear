import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import AllRoutes from "./modules/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(compression());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      let parsedOrigin;
      try {
        parsedOrigin = new URL(origin);
      } catch {
        callback(null, false);
        return;
      }

      const isLocalDevelopment =
        parsedOrigin.protocol === "http:" &&
        ["localhost", "127.0.0.1"].includes(parsedOrigin.hostname);
      const isProduction =
        parsedOrigin.protocol === "https:" &&
        ["apnamenswear.shop", "www.apnamenswear.shop"].includes(
          parsedOrigin.hostname
        );

      callback(null, isLocalDevelopment || isProduction);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
});

app.use(AllRoutes);

app.use("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "backend running successfully...",
    data: null,
    error: null,
  });
});

export default app;