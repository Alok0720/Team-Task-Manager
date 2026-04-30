import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

try {
  console.log("🚀 Starting app setup...");

  // Middleware
  app.use(cors({ origin: "*", credentials: false }));
  console.log("✅ CORS loaded");

  app.use(express.json());
  console.log("✅ JSON parser loaded");

  // Root route
  app.get("/", (req, res) => {
    res.send("Backend running 🚀");
  });
  console.log("✅ Root route loaded");

  // Routes
  app.use('/api/auth', authRoutes);
  console.log("✅ Auth routes loaded");

  app.use('/api/users', userRoutes);
  console.log("✅ User routes loaded");

  app.use('/api/projects', projectRoutes);
  console.log("✅ Project routes loaded");

  app.use('/api/tasks', taskRoutes);
  console.log("✅ Task routes loaded");

} catch (err) {
  console.error("❌ Setup error:", err.stack);
  process.exit(1);
}

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Express error:", err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.stack);
});

// Start server after DB connect
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 8080;

    app.listen(PORT, '0.0.0.0', () => {
      console.log("Server running on port " + PORT);
      console.log("✅ Server listening on " + PORT);
    });

  } catch (err) {
    console.error("❌ DB connection failed:", err.stack);
    process.exit(1);
  }
};

startServer();
