import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Plus } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { name, description });
      setIsModalOpen(false);
      setName('');
      setDescription('');
      fetchProjects();
    } catch (error) {
      console.error('Failed to create project', error);
    }
  };

  return (
    <div className="projects-page fade-in">
      <header className="page-header flex-between">
        <div>
          <h1 className="gradient-text">Projects</h1>
          <p className="subtitle">Manage team projects and directories</p>
        </div>
        {user?.role === 'Admin' && (
          <button className="primary-btn flex-center" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} style={{ marginRight: '8px' }} /> New Project
          </button>
        )}
      </header>

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project._id} className="project-card glass-panel slide-up">
            <h3>{project.name}</h3>
            <p className="text-muted">{project.description}</p>
            <div className="project-meta">
              <span className="created-by">Created by: {project.createdBy?.name}</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal glass-panel slide-down">
            <h2>Create New Project</h2>
            <form onSubmit={handleCreateProject} className="modal-form">
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
