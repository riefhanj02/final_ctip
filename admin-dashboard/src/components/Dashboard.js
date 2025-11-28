import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/authService';
import AdminMap from './AdminMap';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('map');
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Admin Dashboard</h2>
          <p className="user-info">{user?.email || 'Admin'}</p>
        </div>

        <nav className="sidebar-nav">
          <button
            className={activeTab === 'map' ? 'active' : ''}
            onClick={() => setActiveTab('map')}
          >
            📍 Map View
          </button>
          <button
            className={activeTab === 'stats' ? 'active' : ''}
            onClick={() => setActiveTab('stats')}
          >
            📊 Statistics
          </button>
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </button>
          <button
            className={activeTab === 'settings' ? 'active' : ''}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'map' && <AdminMap />}
        {activeTab === 'stats' && (
          <div className="stats-view">
            <h2>Statistics</h2>
            <p>Statistics view coming soon...</p>
          </div>
        )}
        {activeTab === 'users' && (
          <div className="users-view">
            <h2>User Management</h2>
            <p>User management coming soon...</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="settings-view">
            <h2>Settings</h2>
            <p>Settings coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

