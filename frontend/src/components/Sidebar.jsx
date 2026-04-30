import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut, User } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>TaskMaster</h2>
        <p className="role-badge">{user?.role}</p>
      </div>
      <nav className="sidebar-nav">
        <Link to="/" className="nav-link">
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link to="/projects" className="nav-link">
          <FolderKanban size={20} /> Projects
        </Link>
        <Link to="/tasks" className="nav-link">
          <CheckSquare size={20} /> Tasks
        </Link>
        <Link to="/profile" className="nav-link">
          <User size={20} /> Profile
        </Link>
      </nav>
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">{user?.name?.charAt(0)}</div>
          <span className="user-name">{user?.name}</span>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
