import { useState, useEffect } from 'react';
import api from '../services/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setProfile(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch profile', error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="loading fade-in">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="loading fade-in">Failed to load profile.</div>;
  }

  const { user, stats } = profile;

  return (
    <div className="profile-page fade-in">
      <header className="page-header">
        <h1 className="gradient-text">User Profile</h1>
        <p className="subtitle">Manage your account and view your performance</p>
      </header>

      <div className="profile-grid">
        <div className="profile-card glass-panel slide-up">
          <div className="profile-header">
            <div className="profile-avatar-large">
              {user.name.charAt(0)}
            </div>
            <div className="profile-info-large">
              <h2>{user.name}</h2>
              <p className="role-badge" style={{ display: 'inline-block', marginTop: '0.5rem' }}>{user.role}</p>
            </div>
          </div>
          <div className="profile-details">
            <div className="detail-group">
              <label>Email Address</label>
              <p>{user.email}</p>
            </div>
            <div className="detail-group">
              <label>Account Created</label>
              <p>{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="profile-stats slide-up" style={{ animationDelay: '0.1s' }}>
          <h3>Your Task Performance</h3>
          <div className="stats-grid">
            <div className="stat-card glass-panel">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Assigned</div>
            </div>
            <div className="stat-card glass-panel">
              <div className="stat-value text-warning">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="stat-card glass-panel">
              <div className="stat-value text-info">{stats.inProgress}</div>
              <div className="stat-label">In Progress</div>
            </div>
            <div className="stat-card glass-panel">
              <div className="stat-value text-success">{stats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
