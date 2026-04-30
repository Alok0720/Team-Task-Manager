import mongoose from 'mongoose';
import User from './models/User.js';
import Project from './models/Project.js';
import Task from './models/Task.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const cleanAndSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear everything
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    console.log('Database cleared.');

    // Create Admin
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('password123', salt);
    const admin = await User.create({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: adminPassword,
      role: 'Admin'
    });

    // Create Member
    const memberPassword = await bcrypt.hash('password123', salt);
    const member = await User.create({
      name: 'Test Member',
      email: 'member@test.com',
      password: memberPassword,
      role: 'Member'
    });

    // Create a Project
    const project = await Project.create({
      name: 'Production Release',
      description: 'Getting ready for launch.',
      createdBy: admin._id
    });

    console.log('Seeded 1 Admin, 1 Member, 1 Project.');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

cleanAndSeed();
