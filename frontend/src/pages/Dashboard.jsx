import { useState, useEffect } from 'react';
import api from '../services/api';
import { Activity, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await api.get('/tasks');
        setTasks(data);
        calculateStats(data);
      } catch (error) {
        console.error('Failed to fetch tasks', error);
      }
    };
    fetchTasks();
  }, []);

  const calculateStats = (data) => {
    const newStats = {
      total: data.length,
      pending: data.filter((t) => t.status === 'Pending').length,
      inProgress: data.filter((t) => t.status === 'In Progress').length,
      completed: data.filter((t) => t.status === 'Completed').length,
      overdue: data.filter((t) => t.status === 'Overdue').length,
    };
    setStats(newStats);
  };

  const chartData = [
    { name: 'Pending', value: stats.pending, color: '#fbbf24' },
    { name: 'In Progress', value: stats.inProgress, color: '#38bdf8' },
    { name: 'Completed', value: stats.completed, color: '#34d399' },
    { name: 'Overdue', value: stats.overdue, color: '#f87171' },
  ];

  return (
    <div className="dashboard-page fade-in">
      <header className="page-header">
        <h1 className="gradient-text">Dashboard</h1>
        <p className="subtitle">Overview of your tasks and productivity</p>
      </header>

      <div className="dashboard-grid">
        <div className="stats-grid">
          <div className="stat-card glass-panel">
            <div className="stat-icon" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
              <Activity size={28} />
            </div>
            <div className="stat-content">
              <h3>Total Tasks</h3>
              <p className="stat-number text-main">{stats.total}</p>
            </div>
          </div>
          <div className="stat-card glass-panel">
            <div className="stat-icon" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
              <Clock size={28} />
            </div>
            <div className="stat-content">
              <h3>In Progress</h3>
              <p className="stat-number text-info">{stats.inProgress}</p>
            </div>
          </div>
          <div className="stat-card glass-panel">
            <div className="stat-icon" style={{ background: 'rgba(52, 211, 153, 0.1)', color: '#34d399' }}>
              <CheckCircle size={28} />
            </div>
            <div className="stat-content">
              <h3>Completed</h3>
              <p className="stat-number text-success">{stats.completed}</p>
            </div>
          </div>
          <div className="stat-card glass-panel">
            <div className="stat-icon" style={{ background: 'rgba(248, 113, 113, 0.1)', color: '#f87171' }}>
              <AlertTriangle size={28} />
            </div>
            <div className="stat-content">
              <h3>Overdue</h3>
              <p className="stat-number text-warning">{stats.overdue}</p>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card glass-panel slide-up" style={{ animationDelay: '0.1s' }}>
            <h3>Task Distribution</h3>
            {stats.total === 0 ? (
              <div className="empty-state">
                <Activity size={48} className="empty-state-icon" />
                <h3>No data to visualize</h3>
                <p className="text-muted">Create some tasks to see your analytics.</p>
              </div>
            ) : (
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                      contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="recent-tasks glass-panel slide-up" style={{ animationDelay: '0.2s', padding: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Recent Activity</h3>
            {tasks.length === 0 ? (
              <div className="empty-state">
                <CheckCircle size={48} className="empty-state-icon" />
                <h3>All caught up</h3>
                <p className="text-muted">No recent tasks found.</p>
              </div>
            ) : (
              <ul className="task-list">
                {tasks.slice(0, 5).map((task) => (
                  <li key={task._id} className="task-list-item">
                    <div className="task-info">
                      <h4>{task.title}</h4>
                      <p>{task.project?.name || 'No Project'}</p>
                    </div>
                    <div className={`status-badge ${task.status.replace(' ', '-').toLowerCase()}`}>
                      {task.status}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
