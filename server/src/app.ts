import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import authRoutes from "./routes/auth.routes";
import jobsRoutes from "./routes/jobs.routes";
import statsRoutes from "./routes/stats.routes";

const app = express();

app.disable("x-powered-by");
const allowedOrigins = new Set([
  env.CLIENT_URL,
  ...(env.NODE_ENV === "development"
    ? ["http://localhost:5173", "http://127.0.0.1:5173"]
    : [])
]);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    }
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/stats", statsRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
