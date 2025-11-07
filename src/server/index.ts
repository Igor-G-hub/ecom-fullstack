import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Express server is running on port ${PORT}`);
  });
}

export default app;
