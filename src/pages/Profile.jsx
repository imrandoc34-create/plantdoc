import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Shield, Clock, MapPin, Sprout, Activity,
  Calendar, Stethoscope, LogOut, ClipboardList,
  CheckCircle, Leaf, Bell, Settings
} from 'lucide-react';
import './Profile.css';

const Profile = ({ onLogout }) => {
  const [profile, setProfile] = useState(null);
  const [scanCount, setScanCount] = useState(0);
  const [plantCount, setPlantCount] = useState(0);

  useEffect(() => {
    // Load farmer profile from localStorage
    const raw = localStorage.getItem('plantdoc-farmer-profile');
    if (raw) {
      try { setProfile(JSON.parse(raw)); } catch { /* ignore */ }
    }

    // Count timeline plants
    const tlRaw = localStorage.getItem('plantdoc-timeline-plants');
    if (tlRaw) {
      try {
        const plants = JSON.parse(tlRaw);
        if (Array.isArray(plants)) {
          setPlantCount(plants.length);
          setScanCount(plants.reduce((acc, p) => acc + (p.logs?.length || 0), 0));
        }
      } catch { /* ignore */ }
    }
  }, []);

  const formatDate = (isoString) => {
    if (!isoString) return '—';
    const d = new Date(isoString);
    return d.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getInitials = (id) => {
    if (!id) return 'F';
    return id.substring(0, 2).toUpperCase();
  };

  const farmerId = profile?.farmerId || 'Guest Farmer';
  const loginTime = profile?.loginTime;

  const recentActivity = [
    { color: 'green',  text: 'Logged into Farm Diagnostics Dashboard',        time: formatDate(loginTime) },
    { color: 'blue',   text: 'AI Image Scanner accessed for plant health check', time: 'Today' },
    { color: 'yellow', text: 'Plant Timeline reviewed',                        time: 'Today' },
    { color: 'green',  text: 'Treatment Library searched — Neem Oil',          time: 'Today' },
    { color: 'red',    text: 'Soil Moisture Alert triggered on Dashboard',     time: 'Earlier' },
  ];

  return (
    <div className="profile-page">

      {/* ── Hero Banner ── */}
      <div className="profile-hero">
        <div className="profile-hero-bg" />
        <div className="profile-hero-content">
          <div className="profile-avatar">{getInitials(farmerId)}</div>
          <div className="profile-hero-info">
            <div className="profile-hero-name">{profile?.farmName || `${farmerId}'s Farm`}</div>
            <div className="profile-hero-id">Farmer ID: {farmerId}</div>
            <div className="profile-hero-badges">
              <span className="profile-badge active">
                <CheckCircle size={12} /> Active
              </span>
              <span className="profile-badge">
                <MapPin size={12} /> {profile?.region || 'India'}
              </span>
              <span className="profile-badge">
                <Shield size={12} /> {profile?.role || 'Farmer'}
              </span>
            </div>
          </div>
        </div>

        <div className="profile-stats-strip">
          <div className="profile-stat-item">
            <span className="profile-stat-val">{scanCount}</span>
            <span className="profile-stat-label">Scans Done</span>
          </div>
          <div className="profile-stat-item">
            <span className="profile-stat-val">{plantCount}</span>
            <span className="profile-stat-label">Plants Tracked</span>
          </div>
          <div className="profile-stat-item">
            <span className="profile-stat-val">94.2%</span>
            <span className="profile-stat-label">Farm Health</span>
          </div>
          <div className="profile-stat-item">
            <span className="profile-stat-val">12</span>
            <span className="profile-stat-label">Days Active</span>
          </div>
        </div>
      </div>

      <div className="profile-grid">

        {/* ── Farmer Login Sheet ── */}
        <div className="profile-card">
          <div className="profile-card-header">
            <ClipboardList size={18} className="profile-card-icon" />
            <h2>Farmer Login Sheet</h2>
          </div>

          <div className="login-sheet-row">
            <span className="login-sheet-label">
              <User size={14} /> Farmer ID
            </span>
            <span className="login-sheet-value">{farmerId}</span>
          </div>

          <div className="login-sheet-row">
            <span className="login-sheet-label">
              <Shield size={14} /> Role
            </span>
            <span className="login-sheet-value">{profile?.role || 'Farmer'}</span>
          </div>

          <div className="login-sheet-row">
            <span className="login-sheet-label">
              <Leaf size={14} /> Farm Name
            </span>
            <span className="login-sheet-value">{profile?.farmName || '—'}</span>
          </div>

          <div className="login-sheet-row">
            <span className="login-sheet-label">
              <MapPin size={14} /> Region
            </span>
            <span className="login-sheet-value">{profile?.region || '—'}</span>
          </div>

          <div className="login-sheet-row">
            <span className="login-sheet-label">
              <Clock size={14} /> Login Time
            </span>
            <span className="login-sheet-value">{formatDate(loginTime)}</span>
          </div>

          <div className="login-sheet-row">
            <span className="login-sheet-label">
              <Activity size={14} /> Account Status
            </span>
            <span className="login-sheet-value">
              <span className="status-pill active">
                <CheckCircle size={11} /> Active
              </span>
            </span>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="profile-card">
          <div className="profile-card-header">
            <Settings size={18} className="profile-card-icon" />
            <h2>Quick Actions</h2>
          </div>

          <div className="quick-actions-grid">
            <Link to="/disease" className="quick-action-btn">
              <Stethoscope size={18} className="quick-action-icon" />
              Scan a Plant
            </Link>
            <Link to="/timeline" className="quick-action-btn">
              <Activity size={18} className="quick-action-icon" />
              My Timeline
            </Link>
            <Link to="/calendar" className="quick-action-btn">
              <Calendar size={18} className="quick-action-icon" />
              Care Calendar
            </Link>
            <Link to="/treatments" className="quick-action-btn">
              <Sprout size={18} className="quick-action-icon" />
              Treatments
            </Link>
          </div>

          <button className="signout-card-btn" onClick={onLogout}>
            <LogOut size={18} /> Sign Out of Dashboard
          </button>
        </div>

        {/* ── Recent Activity ── */}
        <div className="profile-card full-width">
          <div className="profile-card-header">
            <Bell size={18} className="profile-card-icon" />
            <h2>Recent Session Activity</h2>
          </div>

          {recentActivity.map((a, i) => (
            <div className="activity-item" key={i}>
              <div className={`activity-dot ${a.color}`} />
              <div>
                <div className="activity-text">{a.text}</div>
                <div className="activity-time">{a.time}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Profile;
