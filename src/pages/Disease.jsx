import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle, AlertTriangle, Search, Camera, ClipboardList, Shield, X, ImagePlus, History, Save, Plus } from 'lucide-react';
import { diseasesData, allSymptoms } from '../data/diseases';
import './Disease.css';

const Disease = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('scanner');

  // Scanner State
  const [uploadedImage, setUploadedImage] = useState(null); // base64 preview
  const [imageFile, setImageFile] = useState(null);         // actual File object
  const [isScanning, setIsScanning] = useState(false);
  const [scannerResult, setScannerResult] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // Symptom State
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomResult, setSymptomResult] = useState(null);

  // Timeline Save State
  const [showTimelineSave, setShowTimelineSave] = useState(false);
  const [savedToTimeline, setSavedToTimeline] = useState(false);
  const [timelinePlantMode, setTimelinePlantMode] = useState('existing'); // 'existing' | 'new'
  const [timelineSelectedPlant, setTimelineSelectedPlant] = useState('');
  const [timelineNewPlantName, setTimelineNewPlantName] = useState('');
  const [timelineNewPlantSpecies, setTimelineNewPlantSpecies] = useState('');
  const [timelineNotes, setTimelineNotes] = useState('');

  // Get existing timeline plants from localStorage
  const getTimelinePlants = () => {
    try {
      const raw = localStorage.getItem('plantdoc-timeline-data');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  };

  const saveToTimeline = (result, imageUrl) => {
    const scanPayload = {
      diagnosis: result.name,
      severity: result.severityPct,
      confidence: result.confidence,
      imageUrl: imageUrl || null,
      notes: timelineNotes,
      isHealthy: result.severityPct === 0
    };
    if (timelinePlantMode === 'new' && timelineNewPlantName.trim()) {
      scanPayload.newPlantName = timelineNewPlantName.trim();
      scanPayload.species = timelineNewPlantSpecies.trim() || 'Unknown species';
    } else if (timelinePlantMode === 'existing' && timelineSelectedPlant) {
      scanPayload.plantId = timelineSelectedPlant;
    } else {
      return;
    }
    localStorage.setItem('plantdoc-pending-scan', JSON.stringify(scanPayload));
    setSavedToTimeline(true);
    setShowTimelineSave(false);
  };

  // ── File handling ──────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setUploadError('Only JPG, PNG, or WEBP images are supported.');
      return;
    }
    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be smaller than 5MB.');
      return;
    }

    setUploadError('');
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      // Simulate a change event
      const dt = { target: { files: [file] } };
      handleFileChange(dt);
    }
  };

  const clearImage = () => {
    setUploadedImage(null);
    setImageFile(null);
    setUploadError('');
    setScannerResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Scan (only fires when imageFile exists) ────────────────
  const handleScan = () => {
    if (!imageFile) return; // safety guard
    setIsScanning(true);
    setScannerResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScannerResult({
        name: 'Early Blight',
        severityPct: 85,
        confidence: 94,
        causes: 'Caused by the fungus Alternaria solani. It spreads quickly in warm, humid weather and wet foliage.',
        treatment: 'Apply copper-based fungicides immediately. Remove and destroy infected leaves to prevent spread.',
        prevention: 'Water at the base of the plant to keep leaves dry. Crop rotation and staking plants to improve airflow.'
      });
    }, 2500);
  };

  // ── Symptom Logic ──────────────────────────────────────────
  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const analyzeSymptoms = () => {
    if (selectedSymptoms.length === 0) return;
    let bestMatch = null, maxMatches = 0;
    diseasesData.forEach(disease => {
      const matchCount = disease.symptoms.filter(s => selectedSymptoms.includes(s)).length;
      if (matchCount > maxMatches) { maxMatches = matchCount; bestMatch = disease; }
    });

    setSymptomResult(
      bestMatch && maxMatches > 0
        ? { ...bestMatch, confidence: Math.round((maxMatches / selectedSymptoms.length) * 100) }
        : { name: 'Unknown Condition', severityPct: 0, confidence: 0, causes: 'Unable to pinpoint a single cause based on the selected symptoms.', treatment: 'Consult a local agricultural expert or add more specific symptoms.', prevention: 'Maintain general plant hygiene and optimal watering.' }
    );
  };

  // ── Shared result renderer ─────────────────────────────────
  const renderResult = (result, clearFn, btnText, imageUrl = null) => {
    const existingPlants = getTimelinePlants();
    return (
      <div className="result-area animate-fade-in">
        <div className="result-header">
          <AlertTriangle className="alert-icon" />
          <h2>Diagnosis Complete</h2>
        </div>

        <div className="result-details">
          <div className="detail-row">
            <span className="detail-label">Issue Identified:</span>
            <span className="detail-value font-bold text-red">{result.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Severity Level:</span>
            <span className="detail-value severity-value">
              <div className="severity-bar-bg">
                <div className="severity-bar-fill" style={{ width: `${result.severityPct}%`, backgroundColor: result.severityPct > 70 ? '#ef4444' : result.severityPct > 40 ? '#f59e0b' : '#10b981' }} />
              </div>
              {result.severityPct}%
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Match Score / Confidence:</span>
            <span className="detail-value">{result.confidence}%</span>
          </div>
        </div>

        <div className="info-boxes">
          <div className="info-box causes">
            <h3>Why is this happening?</h3>
            <p>{result.causes}</p>
          </div>
          <div className="info-box treatment">
            <h3><CheckCircle className="inline-icon" /> Treatment</h3>
            <p>{result.treatment}</p>
          </div>
          <div className="info-box prevention">
            <h3><Shield className="inline-icon" /> Prevention</h3>
            <p>{result.prevention}</p>
          </div>
        </div>

        {/* ── Save to Timeline ── */}
        {savedToTimeline ? (
          <div className="timeline-save-success">
            <CheckCircle size={20} style={{ color: '#10b981' }} />
            <span>Saved to Timeline!</span>
            <button className="btn btn-primary timeline-view-btn" onClick={() => navigate('/timeline')}>
              <History size={14} /> View Timeline
            </button>
          </div>
        ) : (
          <>
            {!showTimelineSave ? (
              <button
                className="btn btn-timeline mt-4 w-full"
                onClick={() => { setShowTimelineSave(true); setSavedToTimeline(false); }}
              >
                <History size={16} /> Save to Plant Timeline
              </button>
            ) : (
              <div className="timeline-save-panel">
                <div className="timeline-save-header">
                  <span><History size={16} /> Save Scan to Timeline</span>
                  <button onClick={() => setShowTimelineSave(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                    <X size={16} />
                  </button>
                </div>

                <div className="timeline-save-tabs">
                  <button
                    className={`tl-tab ${timelinePlantMode === 'existing' ? 'active' : ''}`}
                    onClick={() => setTimelinePlantMode('existing')}
                    disabled={existingPlants.length === 0}
                  >
                    Existing Plant
                  </button>
                  <button
                    className={`tl-tab ${timelinePlantMode === 'new' ? 'active' : ''}`}
                    onClick={() => setTimelinePlantMode('new')}
                  >
                    <Plus size={13} /> New Plant
                  </button>
                </div>

                {timelinePlantMode === 'existing' && (
                  existingPlants.length === 0 ? (
                    <p className="tl-empty">No plants in timeline yet. Switch to "New Plant".</p>
                  ) : (
                    <select
                      className="tl-select"
                      value={timelineSelectedPlant}
                      onChange={e => setTimelineSelectedPlant(e.target.value)}
                    >
                      <option value="">-- Select a plant --</option>
                      {existingPlants.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  )
                )}

                {timelinePlantMode === 'new' && (
                  <>
                    <input
                      className="tl-input"
                      placeholder="Plant name (e.g. Herb Garden Basil)"
                      value={timelineNewPlantName}
                      onChange={e => setTimelineNewPlantName(e.target.value)}
                    />
                    <input
                      className="tl-input"
                      placeholder="Species (optional)"
                      value={timelineNewPlantSpecies}
                      onChange={e => setTimelineNewPlantSpecies(e.target.value)}
                    />
                  </>
                )}

                <textarea
                  className="tl-textarea"
                  placeholder="Add notes (treatment applied, observations)..."
                  value={timelineNotes}
                  onChange={e => setTimelineNotes(e.target.value)}
                />

                <button
                  className="btn btn-primary mt-4 w-full"
                  onClick={() => saveToTimeline(result, imageUrl)}
                  disabled={
                    (timelinePlantMode === 'existing' && !timelineSelectedPlant) ||
                    (timelinePlantMode === 'new' && !timelineNewPlantName.trim())
                  }
                >
                  <Save size={15} /> Save Scan to Timeline
                </button>
              </div>
            )}
          </>
        )}

        <button className="btn btn-secondary mt-4 w-full" onClick={() => { clearFn(); setSavedToTimeline(false); setShowTimelineSave(false); }}>{btnText}</button>
      </div>
    );
  };

  // ── JSX ───────────────────────────────────────────────────
  return (
    <div className="disease-container animate-fade-in">
      <div className="scanner-header">
        <h1 className="scanner-title">Plant <span className="text-gradient">Diagnosis</span></h1>
        <p className="scanner-subtitle">Identify issues using AI image analysis or by entering observed symptoms.</p>
      </div>

      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'scanner' ? 'active' : ''}`} onClick={() => setActiveTab('scanner')}>
          <Camera className="tab-icon" /> AI Image Scanner
        </button>
        <button className={`tab-btn ${activeTab === 'symptoms' ? 'active' : ''}`} onClick={() => setActiveTab('symptoms')}>
          <ClipboardList className="tab-icon" /> Symptom Checker
        </button>
      </div>

      <div className="scanner-card glass-panel">

        {/* ── IMAGE SCANNER TAB ── */}
        {activeTab === 'scanner' && (
          <div className="tab-content animate-fade-in">

            {/* No image yet — show drop zone */}
            {!uploadedImage && !isScanning && !scannerResult && (
              <div
                className="upload-area"
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                {/* Hidden real file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden-file-input"
                  onChange={handleFileChange}
                  onClick={e => e.stopPropagation()}
                />
                <div className="upload-icon-wrapper">
                  <ImagePlus className="upload-icon" />
                </div>
                <h3>Upload or Drag & Drop a Plant Image</h3>
                <p>Supports JPG, PNG, WEBP · Max 5MB</p>
                {uploadError && <p className="upload-error" style={{color: 'red', marginTop: '1rem'}}>{uploadError}</p>}
                <button
                  className="btn btn-primary mt-4"
                  type="button"
                  onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                >
                  <UploadCloud className="btn-icon" /> Choose File
                </button>
              </div>
            )}

            {/* Image selected — show preview + Analyze button */}
            {uploadedImage && !isScanning && !scannerResult && (
              <div className="preview-area animate-fade-in" style={{textAlign: 'center'}}>
                <div className="preview-image-wrap" style={{position: 'relative', display: 'inline-block', marginBottom: '1rem'}}>
                  <img src={uploadedImage} alt="Uploaded plant" className="preview-image" style={{maxWidth: '100%', maxHeight: '300px', borderRadius: '8px'}} />
                  <button 
                    className="remove-image-btn" 
                    onClick={clearImage} 
                    title="Remove image"
                    style={{position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="preview-info" style={{marginBottom: '1rem', color: 'var(--color-text-muted)'}}>
                  <p className="preview-filename" style={{fontWeight: 'bold', color: 'var(--color-text)'}}>📎 {imageFile?.name}</p>
                  <p className="preview-size">{(imageFile?.size / 1024).toFixed(1)} KB</p>
                </div>
                <button className="btn btn-primary mt-4 w-full" onClick={handleScan}>
                  <Search className="btn-icon" /> Analyse This Image
                </button>
                <button className="btn btn-secondary mt-4 w-full" onClick={clearImage}>
                  Choose a Different Image
                </button>
              </div>
            )}

            {/* Scanning animation */}
            {isScanning && (
              <div className="scanning-area">
                <div className="scanner-animation">
                  <div className="scan-line" />
                  <img src={uploadedImage} alt="Scanning plant" className="scanning-image" />
                </div>
                <h3 className="scanning-text">Analyzing plant health…</h3>
                <p>Cross-referencing thousands of disease patterns.</p>
              </div>
            )}

            {/* Result */}
            {/* eslint-disable-next-line react-hooks/refs */}
            {scannerResult && renderResult(scannerResult, clearImage, 'Scan Another Plant', uploadedImage)}
          </div>
        )}

        {/* ── SYMPTOM CHECKER TAB ── */}
        {activeTab === 'symptoms' && (
          <div className="tab-content animate-fade-in">
            {!symptomResult ? (
              <div className="symptom-selector">
                <h3 style={{ marginBottom: '1rem', color: 'var(--color-text)' }}>What are you observing?</h3>
                <div className="symptoms-grid">
                  {allSymptoms.map((symp, idx) => (
                    <div
                      key={idx}
                      className={`symptom-tag ${selectedSymptoms.includes(symp) ? 'selected' : ''}`}
                      onClick={() => toggleSymptom(symp)}
                    >
                      {symp}
                    </div>
                  ))}
                </div>
                <button
                  className="btn btn-primary mt-4 w-full"
                  onClick={analyzeSymptoms}
                  disabled={selectedSymptoms.length === 0}
                  style={{ opacity: selectedSymptoms.length === 0 ? 0.5 : 1 }}
                >
                  <Search className="btn-icon" /> Analyze Symptoms
                </button>
              </div>
            ) : (
              renderResult(symptomResult, () => { setSymptomResult(null); setSelectedSymptoms([]); }, 'Check New Symptoms')
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Disease;
