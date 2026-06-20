import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Shield, Clock, MapPin, Sprout, Activity,
  Calendar, Stethoscope, LogOut, Bell, Settings,
  Star, Leaf, BarChart2, Share2, Edit3, Plus,
  Grid, List, ChevronRight, Download, Lock, Globe,
  Moon, Smartphone, Trash2, MessageSquare, HelpCircle,
  CheckCircle, Camera, FileText, Bookmark, Heart,
  Zap, TrendingUp, Users, Award, Database, RefreshCw
} from 'lucide-react';
import './Profile.css';

/* ── helper ── */
const getInitials = (id = 'F') => id.substring(0, 2).toUpperCase();

/* ── Mini Calendar ── */
const MiniCalendar = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear]   = useState(now.getFullYear());

  const waterDays  = [3, 7, 10, 14, 17, 21, 24, 28];
  const fertDays   = [5, 12, 19, 26];
  const pruneDays  = [8, 22];

  const firstDay  = new Date(year, month, 1).getDay();
  const daysInMon = new Date(year, month + 1, 0).getDate();
  const today     = now.getDate();
  const isThisMonth = month === now.getMonth() && year === now.getFullYear();

  const monthNames = ['January','February','March','April','May','June',
                      'July','August','September','October','November','December'];

  const prev = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const next = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push({ empty: true });
  for (let d = 1; d <= daysInMon; d++) {
    cells.push({
      day: d,
      isToday: isThisMonth && d === today,
      water: waterDays.includes(d),
      fert:  fertDays.includes(d),
      prune: pruneDays.includes(d),
    });
  }

  return (
    <div className="mini-calendar">
      <div className="calendar-month-header">
        <button className="cal-nav-btn" onClick={prev}><ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} /></button>
        <span className="calendar-month-label">{monthNames[month]} {year}</span>
        <button className="cal-nav-btn" onClick={next}><ChevronRight size={14} /></button>
      </div>
      <div className="calendar-day-labels">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <div key={d} className="cal-day-label">{d}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {cells.map((c, i) =>
          c.empty ? <div key={i} className="cal-day empty" /> : (
            <div
              key={i}
              className={`cal-day${c.isToday ? ' today' : ''}${c.water ? ' has-water' : ''}${c.fert ? ' has-fert' : ''}${c.prune ? ' has-prune' : ''}`}
            >
              {c.day}
            </div>
          )
        )}
      </div>
      <div className="calendar-legend">
        <span className="legend-item"><span className="legend-dot" style={{ background: '#3b82f6' }} />Water</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#10b981' }} />Fertilize</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: '#f59e0b' }} />Prune</span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
const Profile = ({ onLogout }) => {
  const navigate = useNavigate();
  const [profile, setProfile]         = useState(null);
  const [scanCount, setScanCount]     = useState(0);
  const [plantCount, setPlantCount]   = useState(0);
  const [viewMode, setViewMode]       = useState('grid');
  const [activeTab, setActiveTab]     = useState('plants');
  const [darkMode, setDarkMode]       = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotifs, setPushNotifs]   = useState(false);
  const [completion] = useState(82);

  useEffect(() => {
    const raw = localStorage.getItem('plantdoc-farmer-profile');
    if (raw) { try { setProfile(JSON.parse(raw)); } catch { /**/ } }
    const tlRaw = localStorage.getItem('plantdoc-timeline-plants');
    if (tlRaw) {
      try {
        const plants = JSON.parse(tlRaw);
        if (Array.isArray(plants)) {
          setPlantCount(plants.length);
          setScanCount(plants.reduce((a, p) => a + (p.logs?.length || 0), 0));
        }
      } catch { /**/ }
    }
  }, []);

  const farmerId = profile?.farmerId || 'farmer-482';
  const farmName = profile?.farmName || 'Green Valley Farm';

  /* ── mock data ── */
  const myPlants = [
    { emoji: '🍅', name: 'Tomato A-2',    health: 94, status: 'healthy',  scan: 'Jun 18' },
    { emoji: '🥒', name: 'Cucumber Row',  health: 72, status: 'warning',  scan: 'Jun 17' },
    { emoji: '🍏', name: 'Apple Tree 1',  health: 88, status: 'healthy',  scan: 'Jun 15' },
    { emoji: '🌿', name: 'Basil Bed',     health: 61, status: 'warning',  scan: 'Jun 14' },
    { emoji: '🌶️', name: 'Chilli Patch',  health: 45, status: 'critical', scan: 'Jun 12' },
    { emoji: '🥬', name: 'Spinach Row B', health: 96, status: 'healthy',  scan: 'Jun 10' },
  ];

  const activities = [
    { color: 'green',  emoji: '🔬', title: 'Diagnosed Tomato A-2 — Early Blight detected',      sub: 'Copper Fungicide recommended', time: 'Today, 10:22 AM' },
    { color: 'blue',   emoji: '💧', title: 'Added watering reminder for Cucumber Row',          sub: 'Every 2 days at 7:00 AM',        time: 'Today, 9:05 AM' },
    { color: 'yellow', emoji: '⭐', title: 'Saved Neem Oil treatment to Favourites',            sub: 'Treatments Library',             time: 'Yesterday' },
    { color: 'green',  emoji: '📷', title: 'Uploaded 3 images to Plant Timeline',               sub: 'Chilli Patch scan batch',        time: 'Jun 18' },
    { color: 'purple', emoji: '🏆', title: 'Earned "Plant Protector" Achievement',              sub: '10 diagnoses completed',         time: 'Jun 17' },
    { color: 'red',    emoji: '⚠️', title: 'Soil Moisture Alert — Basil Bed below 30%',        sub: 'Irrigation recommended',         time: 'Jun 16' },
  ];

  const achievements = [
    { emoji: '🌱', name: 'First Diagnosis',    unlocked: true,  progress: 100 },
    { emoji: '🌿', name: 'Plant Protector',    unlocked: true,  progress: 100 },
    { emoji: '🔥', name: '7 Day Streak',       unlocked: true,  progress: 100 },
    { emoji: '📷', name: '50 Scans',           unlocked: true,  progress: 100 },
    { emoji: '🏆', name: '100 Diagnoses',      unlocked: false, progress: 86  },
    { emoji: '⭐', name: 'Premium User',       unlocked: false, progress: 0   },
    { emoji: '🌍', name: 'Farm Guardian',      unlocked: false, progress: 40  },
    { emoji: '💎', name: 'Master Grower',      unlocked: false, progress: 15  },
  ];

  const insights = [
    { bg: 'rgba(16,185,129,0.1)',  icon: '📈', text: 'Your plants are 23% healthier this month compared to May. Keep up the consistent care schedule!',  tag: 'Health Trend' },
    { bg: 'rgba(59,130,246,0.1)', icon: '💧', text: 'Watering reminders have increased plant survival success by 18%. You currently have 6 active reminders.',  tag: 'Care Insight' },
    { bg: 'rgba(245,158,11,0.1)', icon: '🌿', text: 'You diagnose more indoor plants than outdoor crops. Consider scanning your Chilli Patch — last scan was 8 days ago.', tag: 'Recommendation' },
  ];

  const savedItems = {
    plants: [
      { emoji: '🍅', name: 'Tomato Companion',  meta: 'Saved Jun 15' },
      { emoji: '🌺', name: 'Rose Bush Pro',      meta: 'Saved Jun 12' },
      { emoji: '🌾', name: 'Wheat Field B',      meta: 'Saved Jun 9'  },
      { emoji: '🥦', name: 'Broccoli Patch',     meta: 'Saved Jun 7'  },
    ],
    diagnoses: [
      { emoji: '🔬', name: 'Early Blight Guide',   meta: 'Tomato · Critical' },
      { emoji: '🦠', name: 'Powdery Mildew Care',  meta: 'Apple · Moderate'  },
      { emoji: '🌫️', name: 'Bacterial Spot Notes', meta: 'Cucumber · Mild'   },
    ],
    articles: [
      { emoji: '📰', name: 'Organic Pest Control 101',   meta: '8 min read' },
      { emoji: '📰', name: 'Soil pH Mastery Guide',      meta: '12 min read' },
      { emoji: '📰', name: 'Neem Oil: Complete Guide',   meta: '6 min read'  },
    ],
    bookmarks: [
      { emoji: '🔖', name: 'Copper Fungicide',     meta: 'Treatment' },
      { emoji: '🔖', name: 'Companion Planting',   meta: 'Planner tip' },
    ],
  };

  const settingsRows = [
    { icon: <Edit3 size={16} />, bg: 'rgba(16,185,129,0.15)', label: 'Edit Profile',       value: 'Name, ID, Region', toggle: false },
    { icon: <Lock size={16} />,  bg: 'rgba(59,130,246,0.15)',  label: 'Change Password',   value: 'Last changed 30d ago', toggle: false },
    { icon: <Bell size={16} />,  bg: 'rgba(245,158,11,0.15)',  label: 'Notifications',     value: '', toggle: false },
    { icon: <Globe size={16} />, bg: 'rgba(139,92,246,0.15)', label: 'Language',           value: 'English', toggle: false },
    { icon: <Shield size={16} />,bg: 'rgba(239,68,68,0.15)',  label: 'Privacy',            value: 'Public profile', toggle: false },
    { icon: <Smartphone size={16} />, bg: 'rgba(16,185,129,0.15)', label: 'Connected Devices', value: '1 active', toggle: false },
  ];

  const securityRows = [
    { icon: <Shield size={16} />,  bg: 'rgba(16,185,129,0.15)', label: '2-Factor Auth',       value: 'Enabled' },
    { icon: <Clock size={16} />,   bg: 'rgba(59,130,246,0.15)', label: 'Last Login',           value: 'Today, 10:14 AM' },
    { icon: <Smartphone size={16} />, bg: 'rgba(245,158,11,0.15)', label: 'Active Sessions',   value: '1 session' },
    { icon: <CheckCircle size={16} />, bg: 'rgba(16,185,129,0.15)', label: 'Account Verified', value: 'Verified ✓' },
  ];

  return (
    <div className="profile-page">

      {/* ══ 1. HERO ══ */}
      <section className="profile-section">
        <div className="profile-hero">
          <div className="hero-cover">
            <div className="hero-cover-pattern" />
          </div>

          <div className="hero-body">
            <div className="hero-avatar-row">
              <div className="hero-avatar">
                {getInitials(farmerId)}
                <div className="avatar-verified">
                  <CheckCircle size={10} color="#fff" />
                </div>
              </div>
              <div className="hero-action-btns">
                <button className="hero-btn outline"><Share2 size={14} /> Share</button>
                <button className="hero-btn primary"><Edit3 size={14} /> Edit</button>
              </div>
            </div>

            <div className="hero-name">
              {farmName}
              <span className="achievement-badge-mini"><Award size={11} /> Pioneer</span>
            </div>
            <div className="hero-username">@{farmerId} · Plant Explorer 🌱</div>

            <div className="hero-meta">
              <span className="hero-meta-item"><Calendar size={12} /> Joined Jan 2026</span>
              <span className="hero-meta-item"><MapPin size={12} /> {profile?.region || 'India'}</span>
              <span className="hero-meta-item"><Shield size={12} /> {profile?.role || 'Farmer'}</span>
            </div>

            <div className="hero-completion">
              <span className="completion-label">Profile Completion</span>
              <div className="completion-bar-track">
                <div className="completion-bar-fill" style={{ width: `${completion}%` }} />
              </div>
              <span className="completion-pct">{completion}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 2. STATS GRID ══ */}
      <section className="profile-section">
        <div className="profile-section-title"><BarChart2 size={17} className="section-icon" /> Farm Dashboard</div>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-emoji">🔬</div><div className="stat-value">{Math.max(scanCount, 86)}</div><div className="stat-label">Diagnoses</div></div>
          <div className="stat-card"><div className="stat-emoji">❤️</div><div className="stat-value">32</div><div className="stat-label">Saved Plants</div></div>
          <div className="stat-card"><div className="stat-emoji">💚</div><div className="stat-value">78%</div><div className="stat-label">Healthy</div></div>
          <div className="stat-card"><div className="stat-emoji">🔥</div><div className="stat-value">12</div><div className="stat-label">Day Streak</div></div>
          <div className="stat-card"><div className="stat-emoji">⏰</div><div className="stat-value">6</div><div className="stat-label">Reminders</div></div>
          <div className="stat-card"><div className="stat-emoji">🌿</div><div className="stat-value">{Math.max(plantCount, 14)}</div><div className="stat-label">Plants Tracked</div></div>
        </div>
      </section>

      {/* ══ 3. PLANTS COLLECTION ══ */}
      <section className="profile-section">
        <div className="collection-header">
          <div className="profile-section-title" style={{ marginBottom: 0 }}><Leaf size={17} className="section-icon" /> My Plants</div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div className="view-toggle">
              <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}><Grid size={14} /></button>
              <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}><List size={14} /></button>
            </div>
            <button className="add-plant-btn" onClick={() => navigate('/timeline')}><Plus size={14} /> Add Plant</button>
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          {viewMode === 'grid' ? (
            <div className="plants-grid">
              {myPlants.map((p, i) => (
                <div key={i} className="plant-card-profile">
                  <div className="plant-card-img" style={{ background: p.status === 'healthy' ? 'rgba(16,185,129,0.07)' : p.status === 'warning' ? 'rgba(245,158,11,0.07)' : 'rgba(239,68,68,0.07)' }}>
                    {p.emoji}
                  </div>
                  <div className="plant-card-body">
                    <div className="plant-card-name">{p.name}</div>
                    <div className="plant-health-row">
                      <span className={`health-score ${p.status}`}>{p.health}% {p.status === 'healthy' ? '✓' : p.status === 'warning' ? '⚠' : '⚡'}</span>
                    </div>
                    <div className="plant-last-scan">Last scan: {p.scan}</div>
                    <div className="plant-actions" style={{ marginTop: '0.5rem' }}>
                      <button className="plant-action-btn">View</button>
                      <button className="plant-action-btn">Edit</button>
                      <button className="plant-action-btn" onClick={() => navigate('/disease')}>Scan</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="plants-list">
              {myPlants.map((p, i) => (
                <div key={i} className="plant-list-item">
                  <div className="plant-list-emoji">{p.emoji}</div>
                  <div className="plant-list-info">
                    <div className="plant-list-name">{p.name}</div>
                    <div className="plant-list-meta">Health: {p.health}% · Last scan {p.scan}</div>
                  </div>
                  <span className={`health-score ${p.status}`}>{p.status === 'healthy' ? '✓ Good' : p.status === 'warning' ? '⚠ Fair' : '⚡ Poor'}</span>
                  <ChevronRight size={16} style={{ color: 'rgba(255,255,255,0.2)' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ 4. ACTIVITY TIMELINE ══ */}
      <section className="profile-section">
        <div className="profile-section-title"><Activity size={17} className="section-icon" /> Recent Activity</div>
        <div className="glass-card" style={{ padding: '0.5rem 1.25rem' }}>
          <div className="activity-list">
            {activities.map((a, i) => (
              <div key={i} className="activity-item-new">
                <div className="activity-timeline-dot">
                  <div className={`timeline-circle ${a.color}`}>{a.emoji}</div>
                </div>
                <div className="activity-content">
                  <div className="activity-title">{a.title}</div>
                  <div className="activity-subtitle">{a.sub}</div>
                </div>
                <div className="activity-time-badge">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 5. ACHIEVEMENTS ══ */}
      <section className="profile-section">
        <div className="profile-section-title"><Award size={17} className="section-icon" /> Achievements</div>
        <div className="achievements-grid">
          {achievements.map((a, i) => (
            <div key={i} className={`achievement-card ${a.unlocked ? 'unlocked' : 'locked'}`}>
              <div className="achievement-emoji">{a.emoji}</div>
              <div className="achievement-name">{a.name}</div>
              {!a.unlocked && a.progress > 0 && (
                <div className="achievement-progress-track">
                  <div className="achievement-progress-fill" style={{ width: `${a.progress}%` }} />
                </div>
              )}
              {a.unlocked && <div style={{ fontSize: '0.68rem', color: '#10b981', marginTop: '0.3rem', fontWeight: 600 }}>✓ Unlocked</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ══ 6. AI INSIGHTS ══ */}
      <section className="profile-section">
        <div className="profile-section-title"><Zap size={17} className="section-icon" /> AI Insights</div>
        <div className="insights-list">
          {insights.map((ins, i) => (
            <div key={i} className="insight-item">
              <div className="insight-icon-circle" style={{ background: ins.bg }}>{ins.icon}</div>
              <div>
                <div className="insight-text">{ins.text}</div>
                <span className="insight-tag">{ins.tag}</span>
              </div>
            </div>
          ))}
        </div>
        <button className="view-report-btn"><TrendingUp size={16} /> View Detailed Report</button>
      </section>

      {/* ══ 7. CARE CALENDAR ══ */}
      <section className="profile-section">
        <div className="profile-section-title"><Calendar size={17} className="section-icon" /> Care Calendar</div>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <MiniCalendar />
        </div>
      </section>

      {/* ══ 8. SAVED / FAVORITES ══ */}
      <section className="profile-section">
        <div className="profile-section-title"><Bookmark size={17} className="section-icon" /> Saved & Favorites</div>
        <div className="tab-bar">
          {['plants','diagnoses','articles','bookmarks'].map(t => (
            <button key={t} className={`tab-item ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="saved-grid">
          {(savedItems[activeTab] || []).map((s, i) => (
            <div key={i} className="saved-item">
              <div className="saved-emoji">{s.emoji}</div>
              <div className="saved-info">
                <div className="saved-name">{s.name}</div>
                <div className="saved-meta">{s.meta}</div>
              </div>
              <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </section>

      {/* ══ 9. ACCOUNT SETTINGS ══ */}
      <section className="profile-section">
        <div className="profile-section-title"><Settings size={17} className="section-icon" /> Account Management</div>
        <div className="settings-list">
          {settingsRows.map((s, i) => (
            <div key={i} className="setting-row">
              <div className="setting-icon-box" style={{ background: s.bg }}>{s.icon}</div>
              <span className="setting-label">{s.label}</span>
              {s.value && <span className="setting-value">{s.value}</span>}
              <ChevronRight size={16} style={{ color: 'rgba(255,255,255,0.2)' }} />
            </div>
          ))}
          {/* Toggles */}
          <div className="setting-row">
            <div className="setting-icon-box" style={{ background: 'rgba(16,185,129,0.15)' }}><Moon size={16} /></div>
            <span className="setting-label">Dark Mode</span>
            <button className={`toggle-switch ${darkMode ? 'on' : 'off'}`} onClick={() => setDarkMode(v => !v)} />
          </div>
          <div className="setting-row">
            <div className="setting-icon-box" style={{ background: 'rgba(59,130,246,0.15)' }}><Bell size={16} /></div>
            <span className="setting-label">Email Alerts</span>
            <button className={`toggle-switch ${emailAlerts ? 'on' : 'off'}`} onClick={() => setEmailAlerts(v => !v)} />
          </div>
          <div className="setting-row">
            <div className="setting-icon-box" style={{ background: 'rgba(245,158,11,0.15)' }}><Smartphone size={16} /></div>
            <span className="setting-label">Push Notifications</span>
            <button className={`toggle-switch ${pushNotifs ? 'on' : 'off'}`} onClick={() => setPushNotifs(v => !v)} />
          </div>
        </div>
      </section>

      {/* ══ 10. SUBSCRIPTION ══ */}
      <section className="profile-section">
        <div className="profile-section-title"><Star size={17} className="section-icon" /> Subscription</div>
        <div className="subscription-card">
          <div className="plan-header">
            <div>
              <div className="plan-name">Free Plan</div>
              <div className="plan-sub">86 of 100 diagnoses used this month</div>
            </div>
            <span className="plan-badge">⭐ Free Tier</span>
          </div>
          <div className="plan-usage-row">
            <span className="plan-usage-label">Monthly Scans</span>
            <div className="plan-usage-bar"><div className="plan-usage-fill" style={{ width: '86%' }} /></div>
            <span className="plan-usage-pct">86%</span>
          </div>
          <button className="upgrade-btn">⚡ Upgrade to Pro — Unlimited Scans</button>
        </div>
      </section>

      {/* ══ 11. COMMUNITY ══ */}
      <section className="profile-section">
        <div className="profile-section-title"><Users size={17} className="section-icon" /> Community</div>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div className="community-stats">
            <div className="community-stat"><div className="community-stat-val">248</div><div className="community-stat-label">Followers</div></div>
            <div className="community-stat"><div className="community-stat-val">91</div><div className="community-stat-label">Following</div></div>
            <div className="community-stat"><div className="community-stat-val">34</div><div className="community-stat-label">Posts</div></div>
            <div className="community-stat"><div className="community-stat-val">5</div><div className="community-stat-label">Groups</div></div>
          </div>
          <div className="community-btns">
            <button className="community-btn primary"><Users size={14} /> Invite Friends</button>
            <button className="community-btn outline"><Share2 size={14} /> Share Progress</button>
          </div>
        </div>
      </section>

      {/* ══ 12. DATA & EXPORT ══ */}
      <section className="profile-section">
        <div className="profile-section-title"><Database size={17} className="section-icon" /> Data & Export</div>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div className="export-grid">
            <button className="export-btn-card"><span className="export-icon">📄</span>Export PDF</button>
            <button className="export-btn-card"><span className="export-icon">📊</span>Export CSV</button>
            <button className="export-btn-card"><span className="export-icon">💾</span>Backup Data</button>
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <button className="export-btn-card" style={{ width: '100%', flexDirection: 'row', padding: '0.75rem 1rem', borderRadius: '12px' }}>
              <RefreshCw size={16} /> Import Existing Data
            </button>
          </div>
        </div>
      </section>

      {/* ══ 13. SECURITY CENTER ══ */}
      <section className="profile-section">
        <div className="profile-section-title"><Shield size={17} className="section-icon" /> Security Center</div>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div className="security-alert">
            <CheckCircle size={16} style={{ color: '#10b981', flexShrink: 0 }} />
            <span className="security-alert-text">Your account is secure. No suspicious activity detected.</span>
          </div>
          <div className="settings-list">
            {securityRows.map((s, i) => (
              <div key={i} className="setting-row">
                <div className="setting-icon-box" style={{ background: s.bg }}>{s.icon}</div>
                <span className="setting-label">{s.label}</span>
                <span className="setting-value">{s.value}</span>
                <ChevronRight size={16} style={{ color: 'rgba(255,255,255,0.2)' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 14. SUPPORT ══ */}
      <section className="profile-section">
        <div className="profile-section-title"><HelpCircle size={17} className="section-icon" /> Support</div>
        <div className="support-grid">
          <div className="support-item">
            <div className="support-icon" style={{ background: 'rgba(16,185,129,0.12)' }}><HelpCircle size={18} style={{ color: '#10b981' }} /></div>
            <span className="support-label">FAQ</span>
          </div>
          <div className="support-item">
            <div className="support-icon" style={{ background: 'rgba(239,68,68,0.12)' }}><MessageSquare size={18} style={{ color: '#ef4444' }} /></div>
            <span className="support-label">Report Issue</span>
          </div>
          <div className="support-item">
            <div className="support-icon" style={{ background: 'rgba(59,130,246,0.12)' }}><Edit3 size={18} style={{ color: '#3b82f6' }} /></div>
            <span className="support-label">Send Feedback</span>
          </div>
          <div className="support-item">
            <div className="support-icon" style={{ background: 'rgba(245,158,11,0.12)' }}><Sprout size={18} style={{ color: '#f59e0b' }} /></div>
            <span className="support-label">Contact Support</span>
          </div>
        </div>
        <div className="rate-app-row">
          <span className="rate-label">Enjoying PlantDoc? Rate us!</span>
          <span className="rate-stars">⭐⭐⭐⭐⭐</span>
        </div>
      </section>

      {/* ══ 15. FOOTER ACTIONS ══ */}
      <section className="profile-section">
        <div className="profile-footer-actions">
          <Link to="/disease" className="footer-scan-btn">
            <Camera size={20} /> Scan a New Plant
          </Link>
          <div className="footer-secondary-row">
            <button className="footer-logout-btn" onClick={onLogout}>
              <LogOut size={16} /> Sign Out
            </button>
            <button className="footer-delete-btn">
              <Trash2 size={16} /> Delete Account
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Profile;
