import { useState, useEffect } from 'react';
import {
  CalendarDays, Plus, Trash2, Droplets, FlaskConical, Scissors, Wheat, Bell,
  CheckCircle2, XCircle, BarChart3, AlertTriangle, TrendingUp, Lightbulb
} from 'lucide-react';
import { plantsData } from '../data/plants';
import './Calendar.css';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const getDaysUntil = (dateStr) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
};

// ─── Schedule Generator ───────────────────────────────────────────────────────
const generateSchedule = (plantName, plantedDate) => {
  const plant = plantsData.find(p => p.name === plantName);
  if (!plant) return [];
  const events = [];

  const waterInterval = plant.water.toLowerCase().includes('constant') ? 3
    : plant.water.toLowerCase().includes('daily') ? 1
    : plant.water.toLowerCase().includes('week') ? 5 : 7;

  for (let i = 1; i <= 8; i++) {
    events.push({ id: `water-${i}`, type: 'water', label: `Water ${plantName}`, note: plant.water, date: addDays(plantedDate, i * waterInterval), status: 'pending' });
  }
  for (let i = 1; i <= 4; i++) {
    events.push({ id: `fert-${i}`, type: 'fertilizer', label: `Fertilize ${plantName}`, note: plant.fertilizer, date: addDays(plantedDate, i * 14), status: 'pending' });
  }
  for (let i = 1; i <= 3; i++) {
    events.push({ id: `prune-${i}`, type: 'prune', label: `Care Check for ${plantName}`, note: plant.care, date: addDays(plantedDate, i * 21), status: 'pending' });
  }
  const harvestDay = plant.category === 'Grains' ? 90 : plant.category === 'Herbs' ? 45 : plant.category === 'Fruits' ? 120 : 60;
  events.push({ id: 'harvest', type: 'harvest', label: `Harvest ${plantName}`, note: `Based on growing season: ${plant.season}`, date: addDays(plantedDate, harvestDay), status: 'pending' });

  return events.sort((a, b) => new Date(a.date) - new Date(b.date));
};

// ─── Progress Analyser ────────────────────────────────────────────────────────
const analyseProgress = (plant) => {
  const duePast = plant.schedule.filter(e => getDaysUntil(e.date) <= 0 && e.type !== 'harvest');
  const done = duePast.filter(e => e.status === 'done');
  const missed = duePast.filter(e => e.status === 'missed');
  const pending = duePast.filter(e => e.status === 'pending');

  const total = duePast.length || 1;
  const score = Math.round((done.length / total) * 100);

  const faults = [];
  const fixes = [];

  const missedWater = missed.filter(e => e.type === 'water').length;
  const missedFert = missed.filter(e => e.type === 'fertilizer').length;
  const missedPrune = missed.filter(e => e.type === 'prune').length;
  const pendingWater = pending.filter(e => e.type === 'water').length;

  if (missedWater >= 3) {
    faults.push(`⚠️ Severely under-watered — missed ${missedWater} watering sessions`);
    fixes.push('Water immediately and deeply. Check soil moisture daily and set a phone alarm.');
  } else if (missedWater >= 1) {
    faults.push(`💧 Missed ${missedWater} watering(s) — plant may show early stress`);
    fixes.push('Resume regular watering ASAP. Check leaves for wilting or yellowing.');
  }

  if (pendingWater >= 2) {
    faults.push(`🕐 ${pendingWater} watering tasks not marked — are you tracking correctly?`);
    fixes.push('Mark tasks as Done or Missed after every care session for accurate tracking.');
  }

  if (missedFert >= 2) {
    faults.push(`🧪 Missed ${missedFert} fertilizer applications — nutrients may be depleted`);
    fixes.push(`Apply ${plantsData.find(p => p.name === plant.name)?.fertilizer || 'recommended fertilizer'} now.`);
  }

  if (missedPrune >= 2) {
    faults.push(`✂️ Skipped ${missedPrune} care/pruning checks — plant may be getting overcrowded`);
    fixes.push('Do a full plant inspection. Prune dead or diseased branches to restore airflow.');
  }

  if (score === 100 && total > 0) {
    fixes.push('🌟 Excellent work! Keep this routine going for a healthy harvest.');
  }

  return { score, done: done.length, missed: missed.length, total, faults, fixes };
};

const eventConfig = {
  water: { icon: Droplets, color: 'sky', label: 'Watering' },
  fertilizer: { icon: FlaskConical, color: 'amber', label: 'Fertilizer' },
  prune: { icon: Scissors, color: 'purple', label: 'Care / Pruning' },
  harvest: { icon: Wheat, color: 'green', label: 'Harvest' }
};

const scoreColor = (s) => s >= 80 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444';
const scoreLabel = (s) => s >= 80 ? 'Thriving 🌿' : s >= 50 ? 'Needs Attention ⚠️' : 'Critical 🚨';

// ─── Component ────────────────────────────────────────────────────────────────
export default function Calendar() {
  const [myPlants, setMyPlants] = useState(() => {
    const saved = localStorage.getItem('plantDocCalendarPlants');
    return saved ? JSON.parse(saved) : [];
  });
  const [isAdding, setIsAdding] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState('');
  const [plantedDate, setPlantedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterType, setFilterType] = useState('all');
  const [expandedPlant, setExpandedPlant] = useState(null);
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' | 'progress'

  useEffect(() => {
    localStorage.setItem('plantDocCalendarPlants', JSON.stringify(myPlants));
  }, [myPlants]);

  const addPlant = (e) => {
    e.preventDefault();
    if (!selectedPlant) return;
    if (myPlants.find(p => p.name === selectedPlant)) {
      alert(`${selectedPlant} is already on your calendar!`); return;
    }
    const schedule = generateSchedule(selectedPlant, plantedDate);
    setMyPlants([...myPlants, { name: selectedPlant, plantedDate, schedule }]);
    setSelectedPlant(''); setIsAdding(false);
  };

  const removePlant = (name) => {
    setMyPlants(myPlants.filter(p => p.name !== name));
    if (expandedPlant === name) setExpandedPlant(null);
  };

  // Mark event status
  const markEvent = (plantName, eventId, status) => {
    setMyPlants(prev => prev.map(p => {
      if (p.name !== plantName) return p;
      return {
        ...p,
        schedule: p.schedule.map(e => e.id === eventId ? { ...e, status } : e)
      };
    }));
  };

  const allEvents = myPlants.flatMap(p => p.schedule.map(e => ({ ...e, plant: p.name })));
  const upcomingEvents = allEvents
    .filter(e => { const d = getDaysUntil(e.date); return d >= 0 && d <= 60 && (filterType === 'all' || e.type === filterType); })
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const todayEvents = allEvents.filter(e => getDaysUntil(e.date) === 0 && e.status === 'pending');
  const overdueEvents = allEvents.filter(e => getDaysUntil(e.date) < 0 && getDaysUntil(e.date) >= -7 && e.status === 'pending');

  return (
    <div className="calendar-container animate-fade-in">
      {/* Header */}
      <div className="calendar-header">
        <h1 className="calendar-title">Smart Care <span className="text-gradient">Calendar</span></h1>
        <p className="calendar-subtitle">Track tasks, mark them done, and let the app analyse your plant health automatically.</p>
      </div>

      {/* Alert banners */}
      {(todayEvents.length > 0 || overdueEvents.length > 0) && (
        <div className="alerts-section">
          {todayEvents.length > 0 && (
            <div className="alert-banner today-banner">
              <Bell className="alert-banner-icon" />
              <strong>{todayEvents.length} task{todayEvents.length > 1 ? 's' : ''} due TODAY!</strong>
              <span>{todayEvents.map(e => e.label).join(' · ')}</span>
            </div>
          )}
          {overdueEvents.length > 0 && (
            <div className="alert-banner overdue-banner">
              <Bell className="alert-banner-icon" />
              <strong>{overdueEvents.length} overdue task{overdueEvents.length > 1 ? 's' : ''}!</strong>
              <span>{overdueEvents.map(e => e.label).join(' · ')}</span>
            </div>
          )}
        </div>
      )}

      {/* My Garden Panel */}
      <div className="garden-panel glass-panel">
        <div className="garden-panel-header">
          <h2>🪴 My Garden</h2>
          {!isAdding && (
            <button className="btn btn-primary btn-sm" onClick={() => setIsAdding(true)}>
              <Plus size={16} /> Add Plant
            </button>
          )}
        </div>

        {isAdding && (
          <form className="add-plant-form animate-fade-in" onSubmit={addPlant}>
            <div className="form-row">
              <select value={selectedPlant} onChange={e => setSelectedPlant(e.target.value)} required>
                <option value="">Select a plant...</option>
                {plantsData.map(p => <option key={p.id} value={p.name}>{p.name} ({p.category})</option>)}
              </select>
              <input type="date" value={plantedDate} onChange={e => setPlantedDate(e.target.value)} required />
              <button type="submit" className="btn btn-primary btn-sm">Generate Schedule</button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsAdding(false)}>Cancel</button>
            </div>
          </form>
        )}

        {myPlants.length === 0 && !isAdding ? (
          <div className="garden-empty">
            <CalendarDays className="empty-icon" />
            <p>Add a plant to generate your smart care schedule!</p>
          </div>
        ) : (
          <div className="plant-chips">
            {myPlants.map(p => {
              const { score } = analyseProgress(p);
              return (
                <div
                  key={p.name}
                  className={`plant-chip ${expandedPlant === p.name ? 'active' : ''}`}
                  onClick={() => setExpandedPlant(expandedPlant === p.name ? null : p.name)}
                >
                  🌿 {p.name}
                  <span className="chip-score" style={{ color: scoreColor(score) }}>{score}%</span>
                  <span className="chip-date">Planted: {formatDate(p.plantedDate)}</span>
                  <button className="chip-remove" onClick={ev => { ev.stopPropagation(); removePlant(p.name); }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Expanded Plant Detail */}
      {expandedPlant && (() => {
        const plant = myPlants.find(p => p.name === expandedPlant);
        const analysis = analyseProgress(plant);
        return (
          <div className="plant-detail glass-panel animate-fade-in">
            <div className="detail-tabs">
              <button className={`detail-tab ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>
                <CalendarDays size={16} /> Schedule
              </button>
              <button className={`detail-tab ${activeTab === 'progress' ? 'active' : ''}`} onClick={() => setActiveTab('progress')}>
                <BarChart3 size={16} /> Progress & Analysis
              </button>
            </div>

            {/* ── SCHEDULE TAB ── */}
            {activeTab === 'schedule' && (
              <div className="animate-fade-in">
                <h2 className="detail-title">📋 Schedule for <span className="text-gradient">{expandedPlant}</span></h2>
                <div className="schedule-timeline">
                  {plant.schedule.map(ev => {
                    const cfg = eventConfig[ev.type];
                    const Icon = cfg.icon;
                    const daysUntil = getDaysUntil(ev.date);
                    const isPast = daysUntil < 0;
                    return (
                      <div key={ev.id} className={`timeline-item type-${cfg.color} status-${ev.status}`}>
                        <div className={`timeline-icon-wrap bg-${cfg.color}`}>
                          <Icon size={16} />
                        </div>
                        <div className="timeline-content">
                          <div className="timeline-label">{ev.label}</div>
                          <div className="timeline-note">{ev.note}</div>
                        </div>
                        <div className="timeline-right">
                          <div className="timeline-date-col">
                            <span className="date-str">{formatDate(ev.date)}</span>
                            <span className={`days-badge ${daysUntil < 0 ? 'overdue' : daysUntil === 0 ? 'today' : 'upcoming'}`}>
                              {daysUntil < 0 ? `${Math.abs(daysUntil)}d ago` : daysUntil === 0 ? 'Today!' : `in ${daysUntil}d`}
                            </span>
                          </div>
                          {ev.type !== 'harvest' && (
                            <div className="mark-btns">
                              {ev.status !== 'done' && (
                                <button className="mark-btn done" title="Mark as Done" onClick={() => markEvent(plant.name, ev.id, 'done')}>
                                  <CheckCircle2 size={20} />
                                </button>
                              )}
                              {ev.status !== 'missed' && isPast && (
                                <button className="mark-btn missed" title="Mark as Missed" onClick={() => markEvent(plant.name, ev.id, 'missed')}>
                                  <XCircle size={20} />
                                </button>
                              )}
                              {ev.status !== 'pending' && (
                                <button className="mark-btn pending" title="Reset" onClick={() => markEvent(plant.name, ev.id, 'pending')}>↩</button>
                              )}
                            </div>
                          )}
                          {ev.status === 'done' && <span className="status-pill done">✓ Done</span>}
                          {ev.status === 'missed' && <span className="status-pill missed">✗ Missed</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── PROGRESS TAB ── */}
            {activeTab === 'progress' && (
              <div className="progress-panel animate-fade-in">
                <h2 className="detail-title">📊 Progress for <span className="text-gradient">{expandedPlant}</span></h2>

                {/* Health Score Gauge */}
                <div className="health-score-card">
                  <div className="gauge-wrap">
                    <svg viewBox="0 0 120 80" className="gauge-svg">
                      <path d="M10,80 A50,50 0 0,1 110,80" fill="none" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" />
                      <path
                        d="M10,80 A50,50 0 0,1 110,80"
                        fill="none"
                        stroke={scoreColor(analysis.score)}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${analysis.score * 1.57} 157`}
                      />
                    </svg>
                    <div className="gauge-score" style={{ color: scoreColor(analysis.score) }}>
                      {analysis.score}%
                    </div>
                  </div>
                  <div className="gauge-info">
                    <div className="gauge-label" style={{ color: scoreColor(analysis.score) }}>{scoreLabel(analysis.score)}</div>
                    <div className="gauge-stats">
                      <span className="stat done-stat">✓ {analysis.done} Done</span>
                      <span className="stat missed-stat">✗ {analysis.missed} Missed</span>
                      <span className="stat total-stat">📋 {analysis.total} Due</span>
                    </div>
                  </div>
                </div>

                {/* Task Breakdown Bar */}
                <div className="breakdown-section">
                  {['water', 'fertilizer', 'prune'].map(type => {
                    const dueTasks = plant.schedule.filter(e => e.type === type && getDaysUntil(e.date) <= 0);
                    const doneTasks = dueTasks.filter(e => e.status === 'done');
                    const pct = dueTasks.length > 0 ? Math.round((doneTasks.length / dueTasks.length) * 100) : 100;
                    const cfg = eventConfig[type];
                    const Icon = cfg.icon;
                    return (
                      <div key={type} className="breakdown-row">
                        <div className="breakdown-label">
                          <Icon size={16} className={`breakdown-icon type-icon-${cfg.color}`} />
                          {cfg.label}
                        </div>
                        <div className="breakdown-bar-bg">
                          <div className="breakdown-bar-fill" style={{ width: `${pct}%`, backgroundColor: scoreColor(pct) }} />
                        </div>
                        <span className="breakdown-pct">{doneTasks.length}/{dueTasks.length}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Fault Analysis */}
                {analysis.faults.length > 0 && (
                  <div className="faults-section">
                    <h3><AlertTriangle size={18} className="fault-icon" /> Faults Detected</h3>
                    <ul className="faults-list">
                      {analysis.faults.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  </div>
                )}

                {/* Corrective Actions */}
                <div className="fixes-section">
                  <h3><Lightbulb size={18} className="fix-icon" /> Corrective Actions</h3>
                  {analysis.fixes.length === 0 ? (
                    <p className="no-faults">Mark some past tasks as Done or Missed to generate analysis.</p>
                  ) : (
                    <ul className="fixes-list">
                      {analysis.fixes.map((f, i) => (
                        <li key={i}><TrendingUp size={14} className="fix-bullet" /> {f}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Upcoming Events */}
      {myPlants.length > 0 && (
        <div className="upcoming-section">
          <div className="upcoming-header">
            <h2>📅 Upcoming (Next 60 Days)</h2>
            <div className="filter-pills">
              {['all', 'water', 'fertilizer', 'prune', 'harvest'].map(f => (
                <button key={f} className={`filter-pill ${filterType === f ? 'active' : ''}`} onClick={() => setFilterType(f)}>
                  {f === 'all' ? 'All' : eventConfig[f].label}
                </button>
              ))}
            </div>
          </div>
          {upcomingEvents.length === 0 ? (
            <div className="no-upcoming glass-panel">No upcoming tasks in the next 60 days.</div>
          ) : (
            <div className="upcoming-grid">
              {upcomingEvents.map((ev, i) => {
                const cfg = eventConfig[ev.type];
                const Icon = cfg.icon;
                const daysUntil = getDaysUntil(ev.date);
                return (
                  <div key={`${ev.plant}-${ev.id}-${i}`} className={`upcoming-card glass-panel border-${cfg.color}`}>
                    <div className={`upcoming-icon-wrap bg-${cfg.color}`}><Icon size={20} /></div>
                    <div className="upcoming-info">
                      <div className="upcoming-label">{ev.label}</div>
                      <div className="upcoming-plant-name">🌿 {ev.plant}</div>
                      <div className="upcoming-note">{ev.note}</div>
                    </div>
                    <div className="upcoming-date">
                      <span className="upcoming-day-count">{daysUntil === 0 ? 'Today' : `${daysUntil}d`}</span>
                      <span className="upcoming-date-str">{formatDate(ev.date)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
