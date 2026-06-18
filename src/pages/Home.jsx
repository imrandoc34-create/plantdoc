import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Sun,
  Moon,
  CloudRain,
  Sparkles,
  Activity,
  Sprout,
  Thermometer,
  Droplets,
  Compass,
  HeartPulse,
  Clock,
  Check,
  ChevronRight,
  Info,
  CalendarDays,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  X,
  ShieldAlert,
  Snowflake
} from 'lucide-react';
import { plantsData } from '../data/plants';
import { diseasesData } from '../data/diseases';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('plant-doc-theme') || 'lush');

  useEffect(() => {
    localStorage.setItem('plant-doc-theme', theme);
  }, [theme]);

  // AI Scanner Sandbox State
  const [selectedTemplate, setSelectedTemplate] = useState('tomato');
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [scanSaved, setScanSaved] = useState(false);

  // Save demo scan to timeline
  const handleSaveDemoScan = () => {
    if (!scanResult) return;
    const confidenceNum = parseInt(scanResult.confidence, 10) || 90;
    const payload = {
      diagnosis: scanResult.diseaseName,
      severity: scanResult.severity,
      confidence: confidenceNum,
      imageUrl: null,
      notes: `Demo scan from dashboard. Cause: ${scanResult.cause}`,
      isHealthy: scanResult.severity === 0,
      newPlantName: `${scanResult.name} (Demo)`,
      species: 'Demo specimen'
    };
    localStorage.setItem('plantdoc-pending-scan', JSON.stringify(payload));
    setScanSaved(true);
    setTimeout(() => navigate('/timeline'), 900);
  };

  // Sensor Widget State
  const [temp, setTemp] = useState(24.8);
  const [soilMoisture, setSoilMoisture] = useState(42);
  const [humidity, setHumidity] = useState(64);
  const [sunlight, setSunlight] = useState(620);
  const [refreshingSensors, setRefreshingSensors] = useState(false);

  // Weather Simulator State
  const [weatherState, setWeatherState] = useState(() => localStorage.getItem('plantDocWeather') || 'Clear');

  useEffect(() => {
    localStorage.setItem('plantDocWeather', weatherState);
    window.dispatchEvent(new Event('weatherChange'));
  }, [weatherState]);

  // Daily Tasks State
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Spray Neem Oil on Grapes', completed: false, category: 'Fungicide' },
    { id: 2, text: 'Apply Blood Meal fertilizer to Spinach', completed: false, category: 'Nutrition' },
    { id: 3, text: 'Measure soil pH for Blueberry patch', completed: false, category: 'Soil Test' },
    { id: 4, text: 'Prune Apple tree lower branches', completed: true, category: 'Pruning' },
    { id: 5, text: 'Water Basil and Mint in greenbed', completed: false, category: 'Irrigation' }
  ]);

  // Crop Directory State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPlant, setSelectedPlant] = useState(null);

  // Mock scan templates mapping
  const leafTemplates = {
    tomato: {
      name: 'Tomato Leaf',
      diseaseName: 'Early Blight',
      confidence: '97.4%',
      severity: 85,
      severityText: 'Critical',
      cause: 'Alternaria solani (Fungal)',
      symptoms: 'Concentric brown rings, yellow halos, lower leaves dropping.',
      action: 'Apply Copper Fungicide. Prune lower leaves to enhance airflow. Water at the base.'
    },
    apple: {
      name: 'Apple Leaf',
      diseaseName: 'Powdery Mildew',
      confidence: '92.1%',
      severity: 60,
      severityText: 'Moderate',
      cause: 'Podosphaera leucotricha (Fungal)',
      symptoms: 'White powdery coating, leaves curling upwards, stunted shoot growth.',
      action: 'Apply Neem Oil or Sulfur Dust. Prune crowded limbs. Do not water leaves in evening.'
    },
    cucumber: {
      name: 'Cucumber Leaf',
      diseaseName: 'Bacterial Spot',
      confidence: '88.6%',
      severity: 75,
      severityText: 'Moderate',
      cause: 'Xanthomonas campestris (Bacterial)',
      symptoms: 'Angular water-soaked leaf spots, dry brown margins, premature defoliation.',
      action: 'Apply Copper Fungicide early. Keep foliage dry. Sanitize pruning tools before next use.'
    }
  };

  // Run Mock Scanner
  const handleStartScan = () => {
    setScanning(true);
    setScanResult(null);
    setScanProgress(0);
    setScanStatus('Initializing neural network...');

    const steps = [
      { progress: 15, status: 'Adjusting camera parameters...' },
      { progress: 40, status: 'Segmenting leaf edges...' },
      { progress: 65, status: 'Extracting symptom patterns...' },
      { progress: 90, status: 'Evaluating confidence thresholds...' },
      { progress: 100, status: 'Scan complete!' }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setScanProgress(step.progress);
        setScanStatus(step.status);
        if (step.progress === 100) {
          setTimeout(() => {
            setScanning(false);
            setScanResult(leafTemplates[selectedTemplate]);
          }, 300);
        }
      }, (index + 1) * 450);
    });
  };

  // Refresh Sensor Data Simulation
  const handleRefreshSensors = () => {
    setRefreshingSensors(true);
    setTimeout(() => {
      setTemp(Number((22.5 + Math.random() * 5).toFixed(1)));
      setSoilMoisture(Math.floor(32 + Math.random() * 25));
      setHumidity(Math.floor(50 + Math.random() * 30));
      setSunlight(Math.floor(400 + Math.random() * 450));
      setRefreshingSensors(false);
    }, 850);
  };

  // Toggle Task Completion
  const handleToggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Crop Database Filtering
  const cropCategories = ['All', 'Fruits', 'Vegetables', 'Grains', 'Herbs'];
  const filteredCrops = plantsData.filter((crop) => {
    const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          crop.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || crop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Derived dashboard analytics
  const activeAlerts = (soilMoisture < 40 ? 1 : 0) + (humidity > 70 ? 1 : 0);
  const totalTasksPending = tasks.filter((t) => !t.completed).length;

  return (
    <div className={`home-dashboard theme-${theme}`}>
      {/* ── TOP HEADER SECTION ── */}
      <section className="dashboard-header">
        <div className="brand-section animate-fade-in">
          <h1>
            Farm <span className="text-gradient">Diagnostics</span> Dashboard
          </h1>
          <p>Real-time analytics, predictive health intelligence, and crop therapeutics.</p>
        </div>

        {/* Theme Toggles */}
        <div className="theme-switcher">
          <button
            onClick={() => setTheme('lush')}
            className={`theme-btn ${theme === 'lush' ? 'active' : ''}`}
            aria-label="Lush Forest Theme"
          >
            <Sprout size={16} />
            <span className="theme-tooltip">Lush Forest</span>
          </button>
          <button
            onClick={() => setTheme('midnight')}
            className={`theme-btn ${theme === 'midnight' ? 'active' : ''}`}
            aria-label="Midnight Farm Theme"
          >
            <Moon size={16} />
            <span className="theme-tooltip">Midnight Farm</span>
          </button>
          <button
            onClick={() => setTheme('sunset')}
            className={`theme-btn ${theme === 'sunset' ? 'active' : ''}`}
            aria-label="Sunset Orchard Theme"
          >
            <Sun size={16} />
            <span className="theme-tooltip">Sunset Orchard</span>
          </button>
          <button
            onClick={() => setTheme('cyber')}
            className={`theme-btn ${theme === 'cyber' ? 'active' : ''}`}
            aria-label="Cyber AgTech Theme"
          >
            <Sparkles size={16} />
            <span className="theme-tooltip">Cyber AgTech</span>
          </button>
        </div>
      </section>

      {/* ── STATS OVERVIEW SECTION ── */}
      <section className="stats-grid animate-fade-in">
        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper">
            <HeartPulse size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Farm Health Index</span>
            <span className="stat-value">94.2%</span>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper">
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Crops Monitored</span>
            <span className="stat-value">{plantsData.length} Species</span>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper">
            <ShieldAlert size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Critical Alerts</span>
            <span className="stat-value">
              <span className={`indicator-pulse ${activeAlerts > 0 ? 'warning' : ''}`} />
              {activeAlerts === 0 ? 'Normal' : `${activeAlerts} Warning${activeAlerts > 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Reminders Left</span>
            <span className="stat-value">{totalTasksPending} Tasks</span>
          </div>
        </div>
      </section>

      {/* ── ROW 1: SCANNER SANDBOX & WEATHER/TASKS ── */}
      <div className="dashboard-grid">
        {/* Card 1: Interactive Scanner */}
        <div className="glass-card scanner-card">
          <div className="card-title-section">
            <h2>
              <Activity size={20} />
              AI Disease Scanner Demo
            </h2>
            <span className="crop-category-tag">Sandbox Sandbox</span>
          </div>
          
          <p className="hero-subtitle" style={{ fontSize: '0.875rem', marginInline: '0', textAlign: 'left', marginBottom: '1rem' }}>
            Select a sample crop template to test our predictive diagnostics neural engine instantly.
          </p>

          <div className="leaf-template-grid">
            <button
              className={`leaf-template ${selectedTemplate === 'tomato' ? 'selected' : ''}`}
              onClick={() => {
                setSelectedTemplate('tomato');
                setScanResult(null);
              }}
              disabled={scanning}
            >
              <div className="leaf-icon-circle">🍅</div>
              <span>Tomato Leaf</span>
              <p>Alternaria Solani</p>
            </button>
            <button
              className={`leaf-template ${selectedTemplate === 'apple' ? 'selected' : ''}`}
              onClick={() => {
                setSelectedTemplate('apple');
                setScanResult(null);
              }}
              disabled={scanning}
            >
              <div className="leaf-icon-circle">🍏</div>
              <span>Apple Leaf</span>
              <p>Powdery Mildew</p>
            </button>
            <button
              className={`leaf-template ${selectedTemplate === 'cucumber' ? 'selected' : ''}`}
              onClick={() => {
                setSelectedTemplate('cucumber');
                setScanResult(null);
              }}
              disabled={scanning}
            >
              <div className="leaf-icon-circle">🥒</div>
              <span>Cucumber Leaf</span>
              <p>Bacterial Spot</p>
            </button>
          </div>

          <div className="scan-sandbox">
            {!scanning && !scanResult && (
              <div className="scan-prompt">
                <Compass className="scan-prompt-icon" />
                <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--theme-text)' }}>Ready for Diagnostic Scan</p>
                <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                  Click below to scan the selected {leafTemplates[selectedTemplate].name} specimen.
                </p>
                <button
                  className="btn btn-primary-sm"
                  style={{ marginTop: '1rem' }}
                  onClick={handleStartScan}
                >
                  Analyze Plant Leaf
                </button>
              </div>
            )}

            {scanning && (
              <div className="scan-active-container">
                <div className="scan-viewfinder">
                  <div className="laser-line" />
                  <span style={{ fontSize: '4rem' }}>
                    {selectedTemplate === 'tomato' ? '🍅' : selectedTemplate === 'apple' ? '🍏' : '🥒'}
                  </span>
                </div>
                <div className="scan-status-text">{scanStatus}</div>
                <div className="scan-progress-bar">
                  <div
                    className="scan-progress-fill"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}

            {!scanning && scanResult && (
              <div className="scan-result-card">
                <div className="result-header-row">
                  <div>
                    <h3 className="result-title">{scanResult.diseaseName}</h3>
                    <p className="result-cause">{scanResult.cause}</p>
                  </div>
                  <span className={`result-badge ${scanResult.severityText.toLowerCase()}`}>
                    {scanResult.severityText}
                  </span>
                </div>

                <div className="severity-meter-row">
                  <span>Confidence: <strong>{scanResult.confidence}</strong></span>
                  <div className="severity-progress-bg">
                    <div
                      className="severity-progress-fill"
                      style={{ width: `${scanResult.severity}%` }}
                    />
                  </div>
                  <span>Severity: {scanResult.severity}%</span>
                </div>

                <div className="result-details-grid">
                  <div className="result-detail-item">
                    <strong>Observed Symptoms:</strong> {scanResult.symptoms}
                  </div>
                  <div className="result-detail-item">
                    <strong>Therapy Regime:</strong> {scanResult.action}
                  </div>
                </div>

                <div className="result-actions">
                  <Link to="/disease" className="btn btn-primary-sm btn-sm">
                    Open Full Scanner
                  </Link>
                  <Link to="/treatments" className="btn btn-outline-sm btn-sm">
                    Search Treatments
                  </Link>
                  <button
                    className="btn btn-outline-sm btn-sm"
                    onClick={() => { setScanResult(null); setScanSaved(false); }}
                  >
                    Clear Result
                  </button>
                </div>

                {/* Save to Timeline CTA */}
                {scanSaved ? (
                  <div style={{ marginTop: '0.75rem', padding: '0.625rem 1rem', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', fontWeight: 600, color: '#047857', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ✓ Saved — redirecting to Timeline…
                  </div>
                ) : (
                  <button
                    style={{ marginTop: '0.75rem', width: '100%', padding: '0.6rem 1rem', borderRadius: 'var(--radius-xl)', fontWeight: 700, fontSize: '0.82rem', background: 'linear-gradient(135deg,#10b981,#0ea5e9)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onClick={handleSaveDemoScan}
                  >
                    📋 Save to Plant Timeline
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Environment Sensors & Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Sensors */}
          <div className="glass-card">
            <div className="card-title-section">
              <h2>
                <Thermometer size={20} />
                Live Sensor Telemetry
              </h2>
              <button
                className="refresh-btn"
                onClick={handleRefreshSensors}
                disabled={refreshingSensors}
              >
                <RefreshCw size={12} className={refreshingSensors ? 'spinning' : ''} />
                Refresh
              </button>
            </div>

            {/* Warnings Banner */}
            {soilMoisture < 40 && (
              <div className="alerts-banner warning">
                <AlertTriangle size={16} className="alerts-banner-icon" />
                <span><strong>Soil Hydration Critical:</strong> Moisture is low ({soilMoisture}%). Immediate irrigation recommended.</span>
              </div>
            )}
            {humidity > 70 && (
              <div className="alerts-banner">
                <AlertTriangle size={16} className="alerts-banner-icon" />
                <span><strong>Pathogen Spore Warning:</strong> High Humidity ({humidity}%) increases risk of Powdery Mildew infection.</span>
              </div>
            )}

            <div className="sensor-row-grid">
              <div className="sensor-box">
                <Thermometer size={20} className="sensor-box-icon" />
                <div className="sensor-meta">
                  <span className="sensor-name">Ambient Temp</span>
                  <span className="sensor-val">{temp}°C</span>
                </div>
              </div>
              <div className="sensor-box">
                <Droplets size={20} className="sensor-box-icon" />
                <div className="sensor-meta">
                  <span className="sensor-name">Soil Moisture</span>
                  <span className="sensor-val" style={{ color: soilMoisture < 40 ? '#f59e0b' : 'inherit' }}>
                    {soilMoisture}%
                  </span>
                </div>
              </div>
              <div className="sensor-box">
                <CloudRain size={20} className="sensor-box-icon" />
                <div className="sensor-meta">
                  <span className="sensor-name">Relative Humidity</span>
                  <span className="sensor-val" style={{ color: humidity > 70 ? '#ef4444' : 'inherit' }}>
                    {humidity}%
                  </span>
                </div>
              </div>
              <div className="sensor-box">
                <Sun size={20} className="sensor-box-icon" />
                <div className="sensor-meta">
                  <span className="sensor-name">Photosynthesis Lux</span>
                  <span className="sensor-val">{sunlight} W/m²</span>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Weather Simulator */}
          <div className="glass-card">
            <div className="card-title-section">
              <h2>
                <CloudRain size={20} />
                Smart Weather Simulator
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: weatherState !== 'Clear' ? '1rem' : '0' }}>
              <button 
                className={`btn btn-sm ${weatherState === 'Clear' ? 'btn-primary' : 'btn-secondary'}`} 
                onClick={() => setWeatherState('Clear')}>
                <Sun size={14} style={{ marginRight: '4px' }}/> Clear
              </button>
              <button 
                className={`btn btn-sm ${weatherState === 'Heavy Rain' ? 'btn-primary' : 'btn-secondary'}`} 
                onClick={() => setWeatherState('Heavy Rain')}>
                <CloudRain size={14} style={{ marginRight: '4px' }}/> Heavy Rain
              </button>
              <button 
                className={`btn btn-sm ${weatherState === 'Frost' ? 'btn-primary' : 'btn-secondary'}`} 
                onClick={() => setWeatherState('Frost')}>
                <Snowflake size={14} style={{ marginRight: '4px' }}/> Frost
              </button>
              <button 
                className={`btn btn-sm ${weatherState === 'Heatwave' ? 'btn-primary' : 'btn-secondary'}`} 
                onClick={() => setWeatherState('Heatwave')}>
                <Thermometer size={14} style={{ marginRight: '4px' }}/> Heatwave
              </button>
            </div>
            
            {weatherState === 'Heavy Rain' && (
              <div className="alerts-banner" style={{ background: 'rgba(59, 130, 246, 0.1)', borderLeft: '4px solid #3b82f6', color: 'var(--theme-text)' }}>
                <CloudRain size={16} className="alerts-banner-icon" style={{ color: '#3b82f6' }} />
                <span><strong>Action:</strong> Care calendar watering tasks are auto-postponed by 48 hrs to avoid over-saturation.</span>
              </div>
            )}
            {weatherState === 'Frost' && (
              <div className="alerts-banner" style={{ background: 'rgba(139, 92, 246, 0.1)', borderLeft: '4px solid #8b5cf6', color: 'var(--theme-text)' }}>
                <Snowflake size={16} className="alerts-banner-icon" style={{ color: '#8b5cf6' }} />
                <span><strong>Action:</strong> Frost warning active. Pruning tasks are flagged as dangerous. Cover sensitive crops.</span>
              </div>
            )}
            {weatherState === 'Heatwave' && (
              <div className="alerts-banner warning">
                <Thermometer size={16} className="alerts-banner-icon" />
                <span><strong>Action:</strong> Heatwave active. Watering tasks are flagged as urgent. Monitor soil moisture closely.</span>
              </div>
            )}
          </div>

          {/* Daily Tasks */}
          <div className="glass-card" style={{ flex: 1 }}>
            <div className="card-title-section">
              <h2>
                <CalendarDays size={20} />
                Today's Care Scheduler
              </h2>
              <Link to="/calendar" className="action-link">
                View Calendar <ChevronRight size={14} />
              </Link>
            </div>

            <div className="tasks-list">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-item ${task.completed ? 'completed' : ''}`}
                >
                  <div
                    className="task-left"
                    onClick={() => handleToggleTask(task.id)}
                  >
                    <div className={`task-checkbox-custom ${task.completed ? 'checked' : ''}`}>
                      {task.completed && <Check className="task-check-icon" />}
                    </div>
                    <span className="task-label">{task.text}</span>
                  </div>
                  <span className="task-badge">{task.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 2: PLANT DATABASE & RECENT LOGS ── */}
      <div className="dashboard-grid-bottom">
        {/* Card 3: Crop Directory search */}
        <div className="glass-card directory-card">
          <div className="card-title-section">
            <h2>
              <Sprout size={20} />
              Botanical Care Directory
            </h2>
            <Link to="/nutrition" className="action-link">
              Nutrition Guide <ChevronRight size={14} />
            </Link>
          </div>

          <div className="search-controls">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search crops by name..."
                className="search-box-field"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {cropCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="directory-results-container">
            {filteredCrops.length > 0 ? (
              <div className="directory-list">
                {filteredCrops.slice(0, 10).map((crop) => (
                  <div
                    key={crop.id}
                    className="directory-item"
                    onClick={() => setSelectedPlant(crop)}
                  >
                    <div className="crop-main-info">
                      <span className="crop-name">{crop.name}</span>
                      <span className="crop-category-tag">{crop.category}</span>
                    </div>
                    <div className="crop-brief-attr">
                      <span>pH: {crop.ph}</span>
                      <span>Sun: {crop.sunlight}</span>
                      <Info size={14} style={{ color: 'var(--theme-primary)' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-search-text">No crops match your search filters.</p>
            )}
          </div>
        </div>

        {/* Card 4: Recent Diagnostics Logs */}
        <div className="glass-card scans-card">
          <div className="card-title-section">
            <h2>
              <Activity size={20} />
              Recent Diagnostic Logs
            </h2>
            <span className="crop-category-tag">Live Feed</span>
          </div>

          <div className="scans-table-wrapper">
            <table className="scans-table">
              <thead>
                <tr>
                  <th>Crop</th>
                  <th>Diagnosis</th>
                  <th>Severity</th>
                  <th>Accuracy</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tomato A-2</td>
                  <td>Early Blight</td>
                  <td>
                    <span className="severity-pill critical">Critical</span>
                  </td>
                  <td>94%</td>
                  <td>
                    <Link to="/treatments" className="action-link">
                      Treat <ExternalLink size={12} />
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>Squash Bed B</td>
                  <td>Powdery Mildew</td>
                  <td>
                    <span className="severity-pill moderate">Moderate</span>
                  </td>
                  <td>89%</td>
                  <td>
                    <Link to="/treatments" className="action-link">
                      Treat <ExternalLink size={12} />
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>Potato Rows</td>
                  <td>Healthy Crop</td>
                  <td>
                    <span className="severity-pill resolved">Safe</span>
                  </td>
                  <td>98%</td>
                  <td>
                    <span style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted)' }}>None</span>
                  </td>
                </tr>
                <tr>
                  <td>Rose Greenhouse</td>
                  <td>Aphid Activity</td>
                  <td>
                    <span className="severity-pill mild">Mild</span>
                  </td>
                  <td>85%</td>
                  <td>
                    <Link to="/treatments" className="action-link">
                      Treat <ExternalLink size={12} />
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── CROP CARE DETAIL MODAL (PORTAL EMULATION) ── */}
      {selectedPlant && (
        <div
          className="plant-modal-backdrop"
          onClick={() => setSelectedPlant(null)}
        >
          <div
            className="plant-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="plant-modal-header">
              <span className="modal-crop-category">{selectedPlant.category}</span>
              <h3 className="modal-crop-title">{selectedPlant.name}</h3>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedPlant(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="plant-modal-body">
              {/* N-P-K & pH values */}
              <div className="param-grid">
                <div className="param-badge-box">
                  <div className="param-label">NPK Targets</div>
                  <div className="param-val">
                    {selectedPlant.n}-{selectedPlant.p}-{selectedPlant.k}
                  </div>
                </div>
                <div className="param-badge-box">
                  <div className="param-label">Soil pH</div>
                  <div className="param-val">{selectedPlant.ph}</div>
                </div>
                <div className="param-badge-box">
                  <div className="param-label">Light Needs</div>
                  <div className="param-val" style={{ fontSize: '0.85rem' }}>
                    {selectedPlant.sunlight}
                  </div>
                </div>
              </div>

              <div className="modal-info-block">
                <div className="modal-block-label">
                  <Droplets size={14} /> Water Schedule
                </div>
                <p className="modal-block-val">{selectedPlant.water}</p>
              </div>

              <div className="modal-info-block">
                <div className="modal-block-label">
                  <CalendarDays size={14} /> Season & Feeding
                </div>
                <p className="modal-block-val">
                  <strong>Season:</strong> {selectedPlant.season} <br />
                  <strong>Fertilizer:</strong> {selectedPlant.fertilizer}
                </p>
              </div>

              <div className="modal-info-block">
                <div className="modal-block-label">
                  <Sprout size={14} /> Professional Care Directives
                </div>
                <p className="modal-block-val">{selectedPlant.care}</p>
              </div>
            </div>

            <div className="plant-modal-footer">
              <button
                className="btn btn-primary-sm btn-sm"
                onClick={() => setSelectedPlant(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
