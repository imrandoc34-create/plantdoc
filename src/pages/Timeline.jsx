import { useState, useEffect, useRef } from 'react';
import {
  History, Plus, Leaf, AlertTriangle, CheckCircle, Camera,
  CalendarDays, Pencil, Trash2, X, Save, ChevronRight,
  Sprout, TrendingUp, FileImage, ArrowRight
} from 'lucide-react';
import './Timeline.css';

// ── Seed Data ────────────────────────────────────────────────
const SEED_PLANTS = [
  {
    id: 'plant-1',
    name: 'Patio Tomato Patch',
    species: 'Solanum lycopersicum',
    addedAt: '2026-05-10',
    recoveryProgress: 72,
    logs: [
      {
        id: 'log-1a',
        date: '2026-05-10T08:30:00',
        diagnosis: 'Early Blight',
        severity: 85,
        confidence: 94,
        notes: 'Noticed brown concentric rings on lower leaves. Applied copper fungicide immediately and removed infected foliage.',
        imageUrl: 'https://images.unsplash.com/photo-1592921870789-04563d55041c?w=400&h=400&fit=crop',
        isHealthy: false
      },
      {
        id: 'log-1b',
        date: '2026-05-20T09:15:00',
        diagnosis: 'Early Blight (Recovering)',
        severity: 45,
        confidence: 88,
        notes: 'Significant improvement after fungicide treatment. Pruned lower branches and improved airflow. New growth looks healthy.',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
        isHealthy: false
      },
      {
        id: 'log-1c',
        date: '2026-06-01T10:00:00',
        diagnosis: 'Healthy Crop',
        severity: 0,
        confidence: 97,
        notes: 'Plant has fully recovered! Lush green foliage, no signs of disease. Preventive neem oil spray applied.',
        imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop',
        isHealthy: true
      }
    ]
  },
  {
    id: 'plant-2',
    name: 'Greenhouse Roses',
    species: 'Rosa × hybrida',
    addedAt: '2026-04-18',
    recoveryProgress: 40,
    logs: [
      {
        id: 'log-2a',
        date: '2026-04-18T07:00:00',
        diagnosis: 'Powdery Mildew',
        severity: 70,
        confidence: 91,
        notes: 'White powdery coating on new leaf growth. Reduced watering frequency and applied sulfur-based fungicide.',
        imageUrl: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?w=400&h=400&fit=crop',
        isHealthy: false
      },
      {
        id: 'log-2b',
        date: '2026-05-05T11:30:00',
        diagnosis: 'Powdery Mildew (Active)',
        severity: 60,
        confidence: 85,
        notes: 'Still battling mildew. Increased ventilation in greenhouse. Second round of treatment applied.',
        imageUrl: 'https://images.unsplash.com/photo-1562887126-4e2cd4a3e4f2?w=400&h=400&fit=crop',
        isHealthy: false
      }
    ]
  }
];

const LS_KEY = 'plantdoc-timeline-data';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* empty */ }
  return null;
}

function saveToStorage(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

// ── Main Component ────────────────────────────────────────────
export default function Timeline() {
  const theme = localStorage.getItem('plant-doc-theme') || 'lush';

  const [plants, setPlants] = useState(() => {
    const stored = loadFromStorage();
    if (stored && stored.length > 0) return stored;
    return SEED_PLANTS;
  });

  const [activePlantId, setActivePlantId] = useState(() => {
    const stored = loadFromStorage();
    const list = (stored && stored.length > 0) ? stored : SEED_PLANTS;
    return list[0]?.id || null;
  });

  // Modal states
  const [showAddPlant, setShowAddPlant] = useState(false);
  const [showAddLog, setShowAddLog] = useState(false);
  const [showImageModal, setShowImageModal] = useState(null);

  // Edit notes state  { logId: string }
  const [editingLog, setEditingLog] = useState(null);
  const [editNotes, setEditNotes] = useState('');

  // Add plant form
  const [newPlantName, setNewPlantName] = useState('');
  const [newPlantSpecies, setNewPlantSpecies] = useState('');

  // Add log form
  const [newLogDiagnosis, setNewLogDiagnosis] = useState('');
  const [newLogSeverity, setNewLogSeverity] = useState(50);
  const [newLogNotes, setNewLogNotes] = useState('');
  const [newLogIsHealthy, setNewLogIsHealthy] = useState(false);
  const [newLogImage, setNewLogImage] = useState(null); // base64 or url string
  const logFileRef = useRef(null);

  // Persist whenever plants changes
  useEffect(() => {
    saveToStorage(plants);
  }, [plants]);

  function buildLog(scan) {
    return {
      id: `log-${Date.now()}`,
      date: new Date().toISOString(),
      diagnosis: scan.diagnosis || 'Unknown',
      severity: scan.severity || 0,
      confidence: scan.confidence || 0,
      notes: scan.notes || '',
      imageUrl: scan.imageUrl || null,
      isHealthy: scan.isHealthy || false
    };
  }

  // Check for external saves from scanner
  useEffect(() => {
    const pending = localStorage.getItem('plantdoc-pending-scan');
    if (!pending) return;
    try {
      const scan = JSON.parse(pending);
      localStorage.removeItem('plantdoc-pending-scan');

      if (scan.newPlantName) {
        const newId = `plant-${Date.now()}`;
        const newLog = buildLog(scan);
        const newPlant = {
          id: newId,
          name: scan.newPlantName,
          species: scan.species || 'Unknown species',
          addedAt: new Date().toISOString().split('T')[0],
          recoveryProgress: 0,
          logs: [newLog]
        };
        setTimeout(() => {
          setPlants(prev => {
            const updated = [...prev, newPlant];
            saveToStorage(updated);
            return updated;
          });
          setActivePlantId(newId);
        }, 0);
      } else if (scan.plantId) {
        const newLog = buildLog(scan);
        setTimeout(() => {
          setPlants(prev => {
            const updated = prev.map(p => p.id === scan.plantId
              ? { ...p, logs: [...p.logs, newLog] }
              : p
            );
            saveToStorage(updated);
            return updated;
          });
          setActivePlantId(scan.plantId);
        }, 0);
      }
    } catch { /* ignore */ }
  }, []);

  const activePlant = plants.find(p => p.id === activePlantId);
  const sortedLogs = activePlant
    ? [...activePlant.logs].sort((a, b) => new Date(a.date) - new Date(b.date))
    : [];
  const firstLog = sortedLogs[0] || null;
  const latestLog = sortedLogs[sortedLogs.length - 1] || null;

  // ── Handlers ──────────────────────────────────────────────────

  function updateProgress(value) {
    setPlants(prev => prev.map(p =>
      p.id === activePlantId ? { ...p, recoveryProgress: Number(value) } : p
    ));
  }

  function startEditLog(log) {
    setEditingLog(log.id);
    setEditNotes(log.notes);
  }

  function saveEditNotes() {
    setPlants(prev => prev.map(p =>
      p.id === activePlantId
        ? {
            ...p,
            logs: p.logs.map(l =>
              l.id === editingLog ? { ...l, notes: editNotes } : l
            )
          }
        : p
    ));
    setEditingLog(null);
    setEditNotes('');
  }

  function deleteLog(logId) {
    setPlants(prev => prev.map(p =>
      p.id === activePlantId
        ? { ...p, logs: p.logs.filter(l => l.id !== logId) }
        : p
    ));
  }

  function deletePlant(plantId) {
    setPlants(prev => {
      const remaining = prev.filter(p => p.id !== plantId);
      if (activePlantId === plantId) {
        setActivePlantId(remaining[0]?.id || null);
      }
      return remaining;
    });
  }

  function handleAddPlant(e) {
    e.preventDefault();
    if (!newPlantName.trim()) return;
    const newId = `plant-${Date.now()}`;
    const plant = {
      id: newId,
      name: newPlantName.trim(),
      species: newPlantSpecies.trim() || 'Unknown species',
      addedAt: new Date().toISOString().split('T')[0],
      recoveryProgress: 0,
      logs: []
    };
    setPlants(prev => [...prev, plant]);
    setActivePlantId(newId);
    setNewPlantName('');
    setNewPlantSpecies('');
    setShowAddPlant(false);
  }

  function handleLogImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setNewLogImage(ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleAddLog(e) {
    e.preventDefault();
    if (!newLogDiagnosis.trim()) return;
    const log = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString(),
      diagnosis: newLogDiagnosis.trim(),
      severity: Number(newLogSeverity),
      confidence: 100,
      notes: newLogNotes.trim(),
      imageUrl: newLogImage || null,
      isHealthy: newLogIsHealthy
    };
    setPlants(prev => prev.map(p =>
      p.id === activePlantId ? { ...p, logs: [...p.logs, log] } : p
    ));
    setNewLogDiagnosis('');
    setNewLogSeverity(50);
    setNewLogNotes('');
    setNewLogImage(null);
    setNewLogIsHealthy(false);
    setShowAddLog(false);
  }

  const getSeverityColor = (sev) => {
    if (sev > 70) return '#ef4444';
    if (sev > 40) return '#f59e0b';
    return '#10b981';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#10b981';
    if (progress >= 40) return '#f59e0b';
    return '#ef4444';
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className={`timeline-page theme-${theme}`}>
      {/* ── Header ── */}
      <div className="timeline-header-section">
        <div className="timeline-title">
          <h1><History size={28} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />Plant <span className="text-gradient">Timeline</span></h1>
          <p>Track every scan. Watch your plants recover and thrive.</p>
        </div>
        <div className="header-actions">
          <button className="timeline-btn-secondary" onClick={() => setShowAddLog(true)} disabled={!activePlant}>
            <Camera size={16} /> Add Log
          </button>
          <button className="timeline-btn-primary" onClick={() => setShowAddPlant(true)}>
            <Plus size={16} /> New Plant
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="timeline-layout">

        {/* ── LEFT: Plant List Sidebar ── */}
        <div className="plants-sidebar">
          <div className="sidebar-title">
            <Sprout size={16} style={{ display: 'inline', marginRight: '0.4rem', color: 'var(--theme-primary)' }} />
            Monitored Plants ({plants.length})
          </div>

          {plants.length === 0 ? (
            <div className="empty-sidebar">
              <Leaf size={40} style={{ color: 'var(--theme-card-border)', marginBottom: '0.75rem' }} />
              <p style={{ fontWeight: 600 }}>No plants yet</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Click "New Plant" to start tracking.</p>
            </div>
          ) : (
            <div className="plants-list">
              {plants.map(plant => {
                const lastLog = [...plant.logs].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
                return (
                  <button
                    key={plant.id}
                    className={`plant-item-card ${plant.id === activePlantId ? 'active' : ''}`}
                    onClick={() => setActivePlantId(plant.id)}
                  >
                    <div className="plant-card-left">
                      <span className="plant-card-name">{plant.name}</span>
                      <span className="plant-card-species">{plant.species}</span>
                      <div className="plant-card-meta">
                        <span style={{ color: 'var(--theme-text-muted)' }}>{plant.logs.length} log{plant.logs.length !== 1 ? 's' : ''}</span>
                        {lastLog && (
                          <span style={{ color: 'var(--theme-text-muted)' }}>
                            · Last: {new Date(lastLog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="plant-card-right">
                      <span className="plant-card-progress" style={{ color: getProgressColor(plant.recoveryProgress) }}>
                        {plant.recoveryProgress}%
                      </span>
                      <div
                        className={`plant-card-dot ${plant.recoveryProgress < 40 ? 'critical' : plant.recoveryProgress < 70 ? 'warning' : ''}`}
                        style={{ backgroundColor: getProgressColor(plant.recoveryProgress) }}
                      />
                      <ChevronRight size={14} style={{ color: 'var(--theme-text-muted)' }} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── RIGHT: Main Timeline Content ── */}
        <div className="timeline-main-content">
          {!activePlant ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--theme-card-bg)', border: '1px solid var(--theme-card-border)', borderRadius: 'var(--radius-lg)', color: 'var(--theme-text)' }}>
              <Leaf size={64} style={{ color: 'var(--theme-card-border)', marginBottom: '1.5rem' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Select or Add a Plant</h2>
              <p style={{ color: 'var(--theme-text-muted)', marginBottom: '1.5rem' }}>Choose a plant from the sidebar or create a new one to start tracking its health journey.</p>
              <button className="timeline-btn-primary" onClick={() => setShowAddPlant(true)}>
                <Plus size={16} /> Add Your First Plant
              </button>
            </div>
          ) : (
            <>
              {/* ── Plant Header ── */}
              <div style={{
                padding: '1.5rem',
                background: 'var(--theme-card-bg)',
                border: '1px solid var(--theme-card-border)',
                borderRadius: 'var(--radius-lg)',
                backdropFilter: 'blur(16px)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1rem',
                color: 'var(--theme-text)'
              }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{activePlant.name}</h2>
                  <p style={{ color: 'var(--theme-text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>{activePlant.species}</p>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--theme-text-muted)' }}>
                    <span><CalendarDays size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />Added {activePlant.addedAt}</span>
                    <span><History size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />{activePlant.logs.length} scans logged</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="timeline-btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={() => { setShowAddLog(true); }}>
                    <Plus size={14} /> Add Log
                  </button>
                  <button
                    onClick={() => deletePlant(activePlant.id)}
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>

              {/* ── Recovery Progress Widget ── */}
              <div style={{
                padding: '1.5rem',
                background: 'var(--theme-card-bg)',
                border: '1px solid var(--theme-card-border)',
                borderRadius: 'var(--radius-lg)',
                backdropFilter: 'blur(16px)',
                color: 'var(--theme-text)'
              }}>
                <div className="timeline-progress-widget">
                  <div className="progress-header">
                    <span><TrendingUp size={16} style={{ display: 'inline', marginRight: '0.375rem', color: 'var(--theme-primary)' }} />Recovery Progress</span>
                    <span style={{ color: getProgressColor(activePlant.recoveryProgress), fontSize: '1.3rem' }}>{activePlant.recoveryProgress}%</span>
                  </div>
                  <div className="progress-slider-container">
                    <span style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted)' }}>0%</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={activePlant.recoveryProgress}
                      onChange={e => updateProgress(e.target.value)}
                      className="progress-slider"
                      style={{
                        background: `linear-gradient(to right, ${getProgressColor(activePlant.recoveryProgress)} ${activePlant.recoveryProgress}%, rgba(0,0,0,0.1) ${activePlant.recoveryProgress}%)`
                      }}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted)' }}>100%</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--theme-text-muted)', marginTop: '0.25rem' }}>
                    Drag to update recovery status. Changes save automatically.
                  </p>
                </div>
              </div>

              {/* ── Before / After Comparison ── */}
              {sortedLogs.length >= 2 && (
                <div style={{
                  padding: '1.5rem',
                  background: 'var(--theme-card-bg)',
                  border: '1px solid var(--theme-card-border)',
                  borderRadius: 'var(--radius-lg)',
                  backdropFilter: 'blur(16px)',
                  color: 'var(--theme-text)'
                }}>
                  <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Camera size={18} style={{ color: 'var(--theme-primary)' }} /> Before &amp; After Comparison
                  </h3>
                  <div className="comparison-grid">
                    {/* Before */}
                    <div className="comparison-image-container">
                      <span className="comparison-label">Before</span>
                      {firstLog.imageUrl ? (
                        <img
                          src={firstLog.imageUrl}
                          alt="Before scan"
                          className="comparison-img"
                          onClick={() => setShowImageModal(firstLog.imageUrl)}
                        />
                      ) : (
                        <div className="comparison-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.05)', borderRadius: 'var(--radius-md)', border: '1px solid var(--theme-card-border)' }}>
                          <FileImage size={36} style={{ color: 'var(--theme-card-border)' }} />
                        </div>
                      )}
                      <div className="comparison-meta">
                        <span className="comparison-issue" style={{ color: firstLog.isHealthy ? '#10b981' : '#ef4444' }}>
                          {firstLog.diagnosis}
                        </span>
                        <span>{new Date(firstLog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div style={{ display: 'none' }} className="comparison-arrow">
                      <ArrowRight size={24} style={{ color: 'var(--theme-primary)' }} />
                    </div>

                    {/* After */}
                    <div className="comparison-image-container">
                      <span className="comparison-label after">Latest</span>
                      {latestLog.imageUrl ? (
                        <img
                          src={latestLog.imageUrl}
                          alt="Latest scan"
                          className="comparison-img"
                          onClick={() => setShowImageModal(latestLog.imageUrl)}
                        />
                      ) : (
                        <div className="comparison-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.05)', borderRadius: 'var(--radius-md)', border: '1px solid var(--theme-card-border)' }}>
                          <FileImage size={36} style={{ color: 'var(--theme-card-border)' }} />
                        </div>
                      )}
                      <div className="comparison-meta">
                        <span className="comparison-issue" style={{ color: latestLog.isHealthy ? '#10b981' : '#ef4444' }}>
                          {latestLog.diagnosis}
                        </span>
                        <span>{new Date(latestLog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Timeline Logs ── */}
              <div style={{
                padding: '1.5rem',
                background: 'var(--theme-card-bg)',
                border: '1px solid var(--theme-card-border)',
                borderRadius: 'var(--radius-lg)',
                backdropFilter: 'blur(16px)',
                color: 'var(--theme-text)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--theme-card-border)', paddingBottom: '0.75rem' }}>
                  <h3 style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <History size={18} style={{ color: 'var(--theme-primary)' }} /> Scan History
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--theme-primary)', background: 'var(--theme-badge-bg)', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: 600 }}>
                    {sortedLogs.length} entries
                  </span>
                </div>

                {sortedLogs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--theme-text-muted)' }}>
                    <Camera size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                    <p style={{ fontWeight: 600 }}>No scan logs yet</p>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Add your first log to start tracking this plant's health.</p>
                    <button className="timeline-btn-primary" style={{ margin: '1rem auto 0', display: 'flex' }} onClick={() => setShowAddLog(true)}>
                      <Plus size={16} /> Add First Log
                    </button>
                  </div>
                ) : (
                  <div className="timeline-history-container">
                    {[...sortedLogs].reverse().map((log) => (
                      <div key={log.id} className="timeline-log-node">
                        {/* Dot */}
                        <div className="timeline-node-dot">
                          {log.isHealthy
                            ? <CheckCircle size={12} style={{ color: '#10b981' }} />
                            : <AlertTriangle size={12} style={{ color: '#ef4444' }} />
                          }
                        </div>

                        {/* Card */}
                        <div className="timeline-log-card" style={{
                          background: 'rgba(255,255,255,0.15)',
                          border: '1px solid var(--theme-card-border)',
                          borderRadius: 'var(--radius-lg)',
                          backdropFilter: 'blur(8px)'
                        }}>
                          <div className="log-card-header">
                            <span className="log-date">
                              <CalendarDays size={14} style={{ color: 'var(--theme-primary)' }} />
                              {formatDate(log.date)}
                            </span>
                            <div className="log-badges">
                              <span className={`log-badge ${log.isHealthy ? 'healthy' : 'issue'}`}>
                                {log.isHealthy ? '✓ Healthy' : `${log.diagnosis}`}
                              </span>
                              {!log.isHealthy && (
                                <span className="log-badge progress-badge">
                                  Severity: {log.severity}%
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="log-content-wrapper">
                            {/* Image */}
                            {log.imageUrl ? (
                              <img
                                src={log.imageUrl}
                                alt={`Scan - ${log.diagnosis}`}
                                className="log-image-preview"
                                onClick={() => setShowImageModal(log.imageUrl)}
                              />
                            ) : (
                              <div className="log-image-preview" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.05)' }}>
                                <FileImage size={28} style={{ color: 'var(--theme-card-border)' }} />
                              </div>
                            )}

                            <div className="log-details">
                              {/* Severity bar */}
                              {!log.isHealthy && (
                                <div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--theme-text-muted)' }}>
                                    <span>Severity</span>
                                    <span style={{ color: getSeverityColor(log.severity) }}>{log.severity}%</span>
                                  </div>
                                  <div style={{ height: '6px', background: 'rgba(0,0,0,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${log.severity}%`, background: getSeverityColor(log.severity), borderRadius: '3px', transition: 'width 0.5s ease' }} />
                                  </div>
                                </div>
                              )}

                              {log.confidence > 0 && (
                                <p className="log-diagnosis-summary">
                                  AI confidence: <strong>{log.confidence}%</strong>
                                </p>
                              )}

                              {/* Notes */}
                              <div className="log-notes-section">
                                <span className="log-notes-label">📝 Notes</span>
                                {editingLog === log.id ? (
                                  <>
                                    <textarea
                                      className="log-notes-textarea"
                                      value={editNotes}
                                      onChange={e => setEditNotes(e.target.value)}
                                      autoFocus
                                    />
                                    <div className="log-actions">
                                      <button className="log-action-btn cancel" onClick={() => setEditingLog(null)}>
                                        <X size={13} /> Cancel
                                      </button>
                                      <button className="log-action-btn save" onClick={saveEditNotes}>
                                        <Save size={13} /> Save Notes
                                      </button>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <p className="log-notes-text">
                                      {log.notes || <em style={{ opacity: 0.5 }}>No notes added.</em>}
                                    </p>
                                    <div className="log-actions">
                                      <button className="log-action-btn edit" onClick={() => startEditLog(log)}>
                                        <Pencil size={13} /> Edit Notes
                                      </button>
                                      <button className="log-action-btn delete" onClick={() => deleteLog(log.id)}>
                                        <Trash2 size={13} /> Delete
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Image Full-Screen Modal ── */}
      {showImageModal && (
        <div className="timeline-modal-backdrop" onClick={() => setShowImageModal(null)} style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img src={showImageModal} alt="Full size" style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }} />
            <button
              onClick={() => setShowImageModal(null)}
              style={{ position: 'absolute', top: '-12px', right: '-12px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Add Plant Modal ── */}
      {showAddPlant && (
        <div className="timeline-modal-backdrop" onClick={() => setShowAddPlant(false)}>
          <div className="timeline-modal" onClick={e => e.stopPropagation()}>
            <div className="timeline-modal-header">
              <span className="timeline-modal-title"><Sprout size={18} style={{ color: 'var(--color-primary)' }} /> Add New Plant</span>
              <button className="modal-close-btn" onClick={() => setShowAddPlant(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleAddPlant}>
              <div className="timeline-modal-body">
                <div className="form-group">
                  <label className="form-label">Plant Name *</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Backyard Tomatoes"
                    value={newPlantName}
                    onChange={e => setNewPlantName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Species (optional)</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Solanum lycopersicum"
                    value={newPlantSpecies}
                    onChange={e => setNewPlantSpecies(e.target.value)}
                  />
                </div>
              </div>
              <div className="timeline-modal-footer">
                <button type="button" className="timeline-btn-secondary" onClick={() => setShowAddPlant(false)}>Cancel</button>
                <button type="submit" className="timeline-btn-primary" disabled={!newPlantName.trim()}>
                  <Leaf size={15} /> Create Plant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Add Log Modal ── */}
      {showAddLog && activePlant && (
        <div className="timeline-modal-backdrop" onClick={() => setShowAddLog(false)}>
          <div className="timeline-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="timeline-modal-header">
              <span className="timeline-modal-title"><Camera size={18} style={{ color: 'var(--color-primary)' }} /> Add Scan Log</span>
              <button className="modal-close-btn" onClick={() => setShowAddLog(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleAddLog}>
              <div className="timeline-modal-body">
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                  Adding to: <strong>{activePlant.name}</strong>
                </p>
                <div className="form-group">
                  <label className="form-label">Diagnosis / Observation *</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Early Blight, Healthy, Nutrient Deficiency"
                    value={newLogDiagnosis}
                    onChange={e => setNewLogDiagnosis(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={newLogIsHealthy}
                      onChange={e => setNewLogIsHealthy(e.target.checked)}
                      style={{ width: '16px', height: '16px' }}
                    />
                    Mark as healthy (no disease)
                  </label>
                </div>
                {!newLogIsHealthy && (
                  <div className="form-group">
                    <label className="form-label">Severity: {newLogSeverity}%</label>
                    <input
                      type="range" min="0" max="100" value={newLogSeverity}
                      onChange={e => setNewLogSeverity(e.target.value)}
                      className="progress-slider"
                      style={{ width: '100%', background: `linear-gradient(to right, ${getSeverityColor(newLogSeverity)} ${newLogSeverity}%, rgba(0,0,0,0.1) ${newLogSeverity}%)` }}
                    />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Describe what you observed, treatments applied, next steps..."
                    value={newLogNotes}
                    onChange={e => setNewLogNotes(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Photo (optional)</label>
                  <input
                    ref={logFileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleLogImageChange}
                    style={{ display: 'none' }}
                  />
                  {newLogImage ? (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img src={newLogImage} alt="Preview" style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
                      <button type="button" onClick={() => setNewLogImage(null)} style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <div className="modal-file-upload" onClick={() => logFileRef.current?.click()}>
                      <FileImage size={24} style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }} />
                      <p className="modal-file-upload-text">Click to upload a photo · JPG, PNG, WEBP</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="timeline-modal-footer">
                <button type="button" className="timeline-btn-secondary" onClick={() => setShowAddLog(false)}>Cancel</button>
                <button type="submit" className="timeline-btn-primary" disabled={!newLogDiagnosis.trim()}>
                  <Camera size={15} /> Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
