import Project from '../models/Project.js';

export const createProject = async (req, res) => {
  const { name, description } = req.body;

  const project = new Project({
    name,
    description,
    createdBy: req.user._id,
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
};

export const getProjects = async (req, res) => {
  const projects = await Project.find({}).populate('createdBy', 'name email');
  res.json(projects);
};
