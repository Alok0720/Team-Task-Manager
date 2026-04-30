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

// ✅ MIDDLEWARE
app.use(cors({ origin: "*", credentials: false }));
app.use(express.json());

// ✅ ROOT ROUTE (IMPORTANT)
app.get("/", (req, res) => {
  res.status(200).send("Backend running 🚀");
});

// ✅ ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// ✅ ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("ERROR:", err.stack);
  res.status(500).json({ message: "Server Error" });
});

// ✅ HANDLE CRASHES
process.on('unhandledRejection', (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

// ✅ START SERVER AFTER DB
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 8080;

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server listening on ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Startup Error:", err.stack);
    process.exit(1);
  }
};

startServer();
