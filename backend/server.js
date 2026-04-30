import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Root route (for testing Railway)
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// ✅ IMPORTANT PART (Railway fix)
const PORT = process.env.PORT;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
