import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

// Catch unhandled promise rejections so they surface in logs instead of
// silently crashing the process.
process.on('unhandledRejection', (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

const app = express();

try {
  // --- Middleware ---
  console.log("Applying middleware: cors");
  app.use(cors());

  console.log("Applying middleware: express.json");
  app.use(express.json());

  // ✅ Root route (VERY IMPORTANT for browser test)
  console.log("Registering route: GET /");
  app.get("/", (req, res) => {
    res.send("Backend running 🚀");
  });

  // --- API Routes ---
  console.log("Registering route: /api/auth");
  app.use('/api/auth', authRoutes);

  console.log("Registering route: /api/users");
  app.use('/api/users', userRoutes);

  console.log("Registering route: /api/projects");
  app.use('/api/projects', projectRoutes);

  console.log("Registering route: /api/tasks");
  app.use('/api/tasks', taskRoutes);

  // --- Global Express error handler ---
  // Must be registered last, after all routes.
  app.use((err, req, res, next) => {
    console.error("Express Error:", err);
    res.status(500).json({ error: err.message });
  });

} catch (setupError) {
  console.error("Fatal error during app setup:", setupError.stack || setupError);
  process.exit(1);
}

// ✅ Start server ONLY after DB connects
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 8080;

    console.log("PORT VALUE:", PORT);

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`✅ Server listening on ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error.stack || error);
    process.exit(1);
  }
};

startServer();
