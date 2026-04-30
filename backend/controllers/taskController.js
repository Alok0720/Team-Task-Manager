import Task from '../models/Task.js';

export const createTask = async (req, res) => {
  const { title, description, project, assignee, dueDate } = req.body;

  const task = new Task({
    title,
    description,
    project,
    assignee,
    dueDate,
    createdBy: req.user._id,
  });

  const createdTask = await task.save();
  res.status(201).json(createdTask);
};

export const getTasks = async (req, res) => {
  let tasks;
  if (req.user.role === 'Admin') {
    tasks = await Task.find({})
      .populate('project', 'name')
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email');
  } else {
    tasks = await Task.find({ assignee: req.user._id })
      .populate('project', 'name')
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email');
  }
  res.json(tasks);
};

export const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  const task = await Task.findById(req.params.id);

  if (task) {
    // Check if the user is the assignee or an Admin
    if (
      task.assignee.toString() === req.user._id.toString() ||
      req.user.role === 'Admin'
    ) {
      task.status = status;
      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(401).json({ message: 'Not authorized to update this task' });
    }
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
};
