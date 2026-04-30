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

// Middleware
app.use(cors({ origin: "*", credentials: false }));
app.use(express.json());

// ✅ Root route (VERY IMPORTANT for browser test)
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// ✅ Start server ONLY after DB connects
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 8080;

    console.log("PORT VALUE:", PORT);

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log("✅ Server listening on " + PORT);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
