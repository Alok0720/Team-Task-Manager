import express from 'express';
import { createProject, getProjects } from '../controllers/projectController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getProjects).post(protect, admin, createProject);

export default router;
