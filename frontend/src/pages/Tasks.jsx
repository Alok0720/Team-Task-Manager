import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Plus } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(AuthContext);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState('');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    fetchTasks();
    if (user?.role === 'Admin') {
      fetchProjectsAndUsers();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

  const fetchProjectsAndUsers = async () => {
    try {
      const [projRes, usersRes] = await Promise.all([
        api.get('/projects'),
        api.get('/users'),
      ]);
      setProjects(projRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Failed to fetch meta data', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', {
        title,
        description,
        project,
        assignee,
        dueDate,
      });
      setIsModalOpen(false);
      resetForm();
      fetchTasks();
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  return (
    <div className="tasks-page fade-in">
      <header className="page-header flex-between">
        <div>
          <h1 className="gradient-text">Tasks</h1>
          <p className="subtitle">Manage and track task progression</p>
        </div>
        {user?.role === 'Admin' && (
          <button className="primary-btn flex-center" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} style={{ marginRight: '8px' }} /> New Task
          </button>
        )}
      </header>

      <div className="tasks-board">
        {['Pending', 'In Progress', 'Completed', 'Overdue'].map((statusColumn) => (
          <div key={statusColumn} className="task-column">
            <h3 className="column-header">
              {statusColumn}
              <span className="task-count">
                {tasks.filter((t) => t.status === statusColumn).length}
              </span>
            </h3>
            <div className="task-list">
              {tasks
                .filter((task) => task.status === statusColumn)
                .map((task) => (
                  <div key={task._id} className="task-card glass-panel slide-up">
                    <h4>{task.title}</h4>
                    <p className="text-muted">{task.description}</p>
                    <div className="task-meta">
                      <span className="badge">{task.project?.name}</span>
                      <span className="assignee-badge">{task.assignee?.name}</span>
                    </div>
                    <div className="task-actions mt-4">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal glass-panel slide-down">
            <h2>Create New Task</h2>
            <form onSubmit={handleCreateTask} className="modal-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
              <div className="form-row">
                <div className="form-group">
                  <label>Project</label>
                  <select value={project} onChange={(e) => setProject(e.target.value)} required>
                    <option value="" disabled>Select Project</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Assignee</label>
                  <select value={assignee} onChange={(e) => setAssignee(e.target.value)} required>
                    <option value="" disabled>Select Member</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
