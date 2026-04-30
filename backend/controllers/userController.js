import User from '../models/User.js';
import Task from '../models/Task.js';

export const getUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const tasks = await Task.find({ assignee: req.user._id });
    
    const stats = {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'Pending').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      overdue: tasks.filter(t => t.status === 'Overdue').length,
    };

    res.json({ user, stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
