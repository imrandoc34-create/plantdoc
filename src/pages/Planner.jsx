import { useState, useEffect } from 'react';
import { 
  LayoutGrid, Trash2, Sparkles, Save, RefreshCw, Sprout, Moon, 
  Sun, Info, Lightbulb, HelpCircle, X, Check, AlertTriangle 
} from 'lucide-react';
import { companionData } from '../data/companions';
import './Planner.css';

const Planner = () => {
  // Theme State synchronized with Dashboard
  const [theme, setTheme] = useState(() => localStorage.getItem('plant-doc-theme') || 'lush');

  useEffect(() => {
    localStorage.setItem('plant-doc-theme', theme);
    // Dispatch custom event to notify Navbar or other components of theme changes if needed
    window.dispatchEvent(new Event('storage'));
  }, [theme]);

  // Grid Size state (4x4, 5x5, 6x6)
  const [gridSize, setGridSize] = useState(() => {
    const saved = localStorage.getItem('plantDocPlannerGridSize');
    return saved ? parseInt(saved, 10) : 4;
  });

  // Grid Layout mapping coordinate 'r-c' to Plant name (e.g. 'Tomato')
  const [grid, setGrid] = useState(() => {
    const saved = localStorage.getItem('plantDocPlannerGrid');
    return saved ? JSON.parse(saved) : {};
  });

  // Active planting tool from sidebar
  const [selectedDrawerPlant, setSelectedDrawerPlant] = useState(null);

  // Inspector card focus cell {r, c}
  const [selectedCell, setSelectedCell] = useState(null);

  // Filter category for the drawer
  const [activeCategory, setActiveCategory] = useState('All');

  // Sync state changes with local storage
  useEffect(() => {
    localStorage.setItem('plantDocPlannerGrid', JSON.stringify(grid));
  }, [grid]);

  useEffect(() => {
    localStorage.setItem('plantDocPlannerGridSize', gridSize.toString());
  }, [gridSize]);

  // Helper to retrieve companion information for a specific grid cell
  const getCellRelationships = (r, c, currentGrid) => {
    const key = `${r}-${c}`;
    const plantName = currentGrid[key];
    if (!plantName || !companionData[plantName]) {
      return { companions: [], combatants: [] };
    }

    const plantInfo = companionData[plantName];
    // Define cardinal directions
    const adjacents = [
      { r: r - 1, c, dir: 'Above' },
      { r: r + 1, c, dir: 'Below' },
      { r, c: c - 1, dir: 'Left' },
      { r, c: c + 1, dir: 'Right' }
    ];

    const cellCompanions = [];
    const cellCombatants = [];

    adjacents.forEach(adj => {
      // Check grid bounds
      if (adj.r >= 0 && adj.r < gridSize && adj.c >= 0 && adj.c < gridSize) {
        const neighborKey = `${adj.r}-${adj.c}`;
        const neighborName = currentGrid[neighborKey];
        if (neighborName && neighborName !== plantName) {
          // If it is in the companions list of A
          const isComp = plantInfo.companions.includes(neighborName);
          const isComb = plantInfo.combatants.includes(neighborName);

          if (isComp) {
            cellCompanions.push({
              name: neighborName,
              icon: companionData[neighborName]?.icon || '🌱',
              dir: adj.dir,
              details: plantInfo.details[neighborName] || 'Beneficial companion plant.'
            });
          } else if (isComb) {
            cellCombatants.push({
              name: neighborName,
              icon: companionData[neighborName]?.icon || '🌱',
              dir: adj.dir,
              details: plantInfo.details[neighborName] || 'Competing or incompatible plant.'
            });
          }
        }
      }
    });

    return { companions: cellCompanions, combatants: cellCombatants };
  };

  // Click handler for grid cells
  const handleCellClick = (r, c) => {
    const key = `${r}-${c}`;
    const occupied = grid[key];

    if (selectedDrawerPlant) {
      // Planting mode is active
      const newGrid = { ...grid };
      newGrid[key] = selectedDrawerPlant;
      setGrid(newGrid);
      
      // Update selected cell inspector to show the newly planted crop
      setSelectedCell({ r, c });
    } else {
      // Selection / Inspector mode
      if (occupied) {
        if (selectedCell && selectedCell.r === r && selectedCell.c === c) {
          // Double click same cell deselects it
          setSelectedCell(null);
        } else {
          setSelectedCell({ r, c });
        }
      } else {
        setSelectedCell(null);
      }
    }
  };

  // Remove a plant from a specific slot
  const handleRemovePlant = (r, c) => {
    const key = `${r}-${c}`;
    const newGrid = { ...grid };
    delete newGrid[key];
    setGrid(newGrid);
    if (selectedCell && selectedCell.r === r && selectedCell.c === c) {
      setSelectedCell(null);
    }
  };

  // Clear entire grid
  const handleClearGrid = () => {
    if (window.confirm("Are you sure you want to clear your garden grid?")) {
      setGrid({});
      setSelectedCell(null);
      setSelectedDrawerPlant(null);
    }
  };

  // Save layout notice
  const handleSaveLayout = () => {
    localStorage.setItem('plantDocPlannerGrid', JSON.stringify(grid));
    localStorage.setItem('plantDocPlannerGridSize', gridSize.toString());
    alert("Garden layout saved successfully!");
  };

  // AI Autofill Companion Optimizer
  const handleAutofill = () => {
    const newGrid = { ...grid };
    let filledCount = 0;
    
    // Find all empty cells in current grid dimensions
    const emptyCells = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (!grid[`${r}-${c}`]) {
          emptyCells.push({ r, c });
        }
      }
    }
    
    // If the grid is completely empty, put a Tomato in the center
    const totalSlots = gridSize * gridSize;
    if (emptyCells.length === totalSlots) {
      const center = Math.floor(gridSize / 2);
      newGrid[`${center}-${center}`] = 'Tomato';
      setGrid(newGrid);
      setSelectedCell({ r: center, c: center });
      return;
    }
    
    // Score all empty cells that touch a plant
    const suggestions = [];
    
    emptyCells.forEach(({ r, c }) => {
      const adjacents = [
        { r: r - 1, c },
        { r: r + 1, c },
        { r, c: c - 1 },
        { r, c: c + 1 }
      ].filter(n => n.r >= 0 && n.r < gridSize && n.c >= 0 && n.c < gridSize);
      
      const occupiedNeighbors = adjacents.filter(n => grid[`${n.r}-${n.c}`]);
      if (occupiedNeighbors.length === 0) return; // skip isolated cells
      
      // Test each plant catalog item
      Object.keys(companionData).forEach(plantName => {
        const plantInfo = companionData[plantName];
        let score = 0;
        
        occupiedNeighbors.forEach(n => {
          const neighborPlant = grid[`${n.r}-${n.c}`];
          if (plantInfo.companions.includes(neighborPlant)) {
            score += 2; // high weight for companion
          }
          if (plantInfo.combatants.includes(neighborPlant)) {
            score -= 4; // heavy penalty for combatants
          }
        });
        
        if (score > 0) {
          suggestions.push({ r, c, plant: plantName, score });
        }
      });
    });
    
    // Sort suggestions by compatibility score descending
    suggestions.sort((a, b) => b.score - a.score);
    
    // Place the top suggestions incrementally (max 3 at a time)
    const maxToPlace = Math.min(3, suggestions.length);
    for (let i = 0; i < maxToPlace; i++) {
      const { r, c, plant } = suggestions[i];
      // Prevent overlapping updates
      if (!newGrid[`${r}-${c}`]) {
        newGrid[`${r}-${c}`] = plant;
        filledCount++;
      }
    }
    
    if (filledCount > 0) {
      setGrid(newGrid);
    } else {
      alert("No optimal companion recommendations found for the empty adjacent spots. Place another crop manually to trigger companion suggestions!");
    }
  };

  // Calculate global grid diagnostics
  const calculateStats = () => {
    let totalPlants = 0;
    let beneficialBonds = 0;
    let conflictBonds = 0;
    
    const checkedPairs = new Set();
    
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const key = `${r}-${c}`;
        const plant = grid[key];
        if (plant) {
          totalPlants++;
          
          // Check right and down to calculate unique edges
          const edges = [
            { r, c: c + 1 },
            { r: r + 1, c }
          ];
          
          edges.forEach(edge => {
            if (edge.r < gridSize && edge.c < gridSize) {
              const edgeKey = `${edge.r}-${edge.c}`;
              const neighborPlant = grid[edgeKey];
              if (neighborPlant) {
                const pairId = [key, edgeKey].sort().join('_');
                if (!checkedPairs.has(pairId)) {
                  checkedPairs.add(pairId);
                  
                  const pInfo = companionData[plant];
                  const nInfo = companionData[neighborPlant];
                  
                  const companionMatch = (pInfo?.companions.includes(neighborPlant)) || (nInfo?.companions.includes(plant));
                  const conflictMatch = (pInfo?.combatants.includes(neighborPlant)) || (nInfo?.combatants.includes(plant));
                  
                  if (companionMatch) beneficialBonds++;
                  if (conflictMatch) conflictBonds++;
                }
              }
            }
          });
        }
      }
    }
    
    let harmonyScore = 100;
    const totalBonds = beneficialBonds + conflictBonds;
    if (totalBonds > 0) {
      harmonyScore = Math.max(0, Math.min(100, Math.round((beneficialBonds / (beneficialBonds + conflictBonds * 1.5)) * 100)));
    }
    
    return { totalPlants, beneficialBonds, conflictBonds, harmonyScore };
  };

  const { totalPlants, beneficialBonds, conflictBonds, harmonyScore } = calculateStats();

  // Filter drawer plants
  const drawerPlants = Object.values(companionData).filter(p => {
    return activeCategory === 'All' || p.category === activeCategory;
  });

  // Get selected inspector cell information
  const inspectorPlantName = selectedCell ? grid[`${selectedCell.r}-${selectedCell.c}`] : null;
  const inspectorRelationships = selectedCell ? getCellRelationships(selectedCell.r, selectedCell.c, grid) : { companions: [], combatants: [] };
  const inspectorPlantInfo = inspectorPlantName ? companionData[inspectorPlantName] : null;

  return (
    <div className={`planner-container theme-${theme} animate-fade-in`}>
      {/* ── HEADER SECTION ── */}
      <header className="planner-header-section">
        <div className="planner-title-area">
          <h1>
            Garden <span className="text-gradient">Companion Planner</span>
          </h1>
          <p>Design a highly bio-diverse, pest-resistant garden plot using companion planting science.</p>
        </div>

        {/* Theme Switcher matching dashboard style */}
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
      </header>

      {/* ── ACTIVE TOOL NOTIFIER ── */}
      {selectedDrawerPlant ? (
        <div className="trowel-indicator">
          <span>🚜 <strong>Planting Mode:</strong> {companionData[selectedDrawerPlant]?.icon} {selectedDrawerPlant}</span>
          <button 
            onClick={() => setSelectedDrawerPlant(null)} 
            style={{ display: 'inline-flex', background: 'none', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer', marginInlineStart: '0.5rem' }}
            title="Cancel Planting"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="trowel-indicator" style={{ opacity: 0.85, borderStyle: 'dashed' }}>
          <span>🔍 <strong>Selection Mode:</strong> Click filled cells to view synergy diagnostics.</span>
        </div>
      )}

      {/* ── PLANNER MAIN GRID LAYOUT ── */}
      <div className="planner-grid-layout">
        
        {/* Left Side: Workspace and Controls */}
        <div className="grid-workspace">
          
          <div className="planner-controls">
            {/* Grid Size Selector */}
            <div className="size-select-wrap">
              <button
                className={`size-btn ${gridSize === 4 ? 'active' : ''}`}
                onClick={() => { setGridSize(4); setSelectedCell(null); }}
              >
                4x4 Plot
              </button>
              <button
                className={`size-btn ${gridSize === 5 ? 'active' : ''}`}
                onClick={() => { setGridSize(5); setSelectedCell(null); }}
              >
                5x5 Plot
              </button>
              <button
                className={`size-btn ${gridSize === 6 ? 'active' : ''}`}
                onClick={() => { setGridSize(6); setSelectedCell(null); }}
              >
                6x6 Plot
              </button>
            </div>

            {/* Action buttons */}
            <div className="planner-action-btns">
              <button className="btn btn-autofill" onClick={handleAutofill} title="AI Companion Autofill Optimizer">
                <Sparkles size={16} /> AI Autofill
              </button>
              <button className="btn btn-primary" onClick={handleSaveLayout} title="Save layout to local storage">
                <Save size={16} /> Save Plot
              </button>
              <button className="btn btn-danger" onClick={handleClearGrid} title="Clear entire grid layout">
                <Trash2 size={16} /> Clear Grid
              </button>
            </div>
          </div>

          {/* Core Interactive Sandbox */}
          <div className="garden-grid-container">
            <div 
              className="garden-grid"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`
              }}
            >
              {Array.from({ length: gridSize }).map((_, r) => (
                Array.from({ length: gridSize }).map((_, c) => {
                  const key = `${r}-${c}`;
                  const plantName = grid[key];
                  const isCellSelected = selectedCell && selectedCell.r === r && selectedCell.c === c;
                  const { companions, combatants } = getCellRelationships(r, c, grid);
                  
                  let cellClass = "";
                  if (plantName) {
                    cellClass += " cell-occupied";
                    if (companions.length > 0 && combatants.length === 0) {
                      cellClass += " cell-companion";
                    } else if (combatants.length > 0) {
                      cellClass += " cell-conflict";
                    }
                  }
                  if (isCellSelected) cellClass += " cell-selected";

                  return (
                    <div 
                      key={key} 
                      className={`grid-cell${cellClass}`}
                      onClick={() => handleCellClick(r, c)}
                    >
                      {plantName ? (
                        <>
                          <span className="cell-emoji">{companionData[plantName]?.icon}</span>
                          <span className="cell-name">{plantName}</span>
                          {companions.length > 0 && combatants.length === 0 && (
                            <span className="cell-status-badge companion">Synergy</span>
                          )}
                          {combatants.length > 0 && (
                            <span className="cell-status-badge conflict">Warning</span>
                          )}
                        </>
                      ) : (
                        <button className="cell-empty-btn">+</button>
                      )}
                    </div>
                  );
                })
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Sidebar Panels (Catalog + Stats + Inspector) */}
        <div className="planner-sidebar">

          {/* Card 1: Garden Synergy Index */}
          <div className="sidebar-panel stats-summary-card">
            <h2>
              <Sprout size={18} /> Garden Diagnostic Index
            </h2>
            <div className="harmony-meter-row">
              <div className="harmony-header">
                <span>Garden Harmony Score</span>
                <span>{harmonyScore}%</span>
              </div>
              <div className="harmony-bar-bg">
                <div 
                  className="harmony-bar-fill" 
                  style={{ 
                    width: `${harmonyScore}%`,
                    backgroundColor: harmonyScore >= 80 ? '#10b981' : harmonyScore >= 50 ? '#f59e0b' : '#ef4444' 
                  }} 
                />
              </div>
            </div>

            <div className="stats-count-grid">
              <div className="stat-box">
                <span className="stat-box-num">{totalPlants}</span>
                <span className="stat-box-lbl">Crops</span>
              </div>
              <div className="stat-box">
                <span className="stat-box-num" style={{ color: beneficialBonds > 0 ? '#10b981' : 'inherit' }}>
                  {beneficialBonds}
                </span>
                <span className="stat-box-lbl">Synergies</span>
              </div>
              <div className="stat-box">
                <span className="stat-box-num" style={{ color: conflictBonds > 0 ? '#f97316' : 'inherit' }}>
                  {conflictBonds}
                </span>
                <span className="stat-box-lbl">Conflicts</span>
              </div>
              <div className="stat-box">
                <span className="stat-box-num">
                  {gridSize * gridSize - totalPlants}
                </span>
                <span className="stat-box-lbl">Empty Slots</span>
              </div>
            </div>
          </div>

          {/* Card 2: Plant Selector Drawer */}
          <div className="sidebar-panel plant-drawer-card">
            <h2>
              <LayoutGrid size={18} /> Plant Catalog
            </h2>
            
            {/* Category Scroll Filter */}
            <div className="drawer-filter-row">
              {['All', 'Vegetables', 'Herbs', 'Flowers', 'Grains'].map(cat => (
                <button
                  key={cat}
                  className={`filter-pill-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Plants Grid */}
            <div className="drawer-plants-grid">
              {drawerPlants.map(plant => (
                <div
                  key={plant.name}
                  className={`drawer-plant-item ${selectedDrawerPlant === plant.name ? 'active' : ''}`}
                  onClick={() => {
                    if (selectedDrawerPlant === plant.name) {
                      setSelectedDrawerPlant(null); // click again deselects
                    } else {
                      setSelectedDrawerPlant(plant.name);
                    }
                  }}
                  title={`Select ${plant.name} to plant in the grid`}
                >
                  <span className="drawer-plant-emoji">{plant.icon}</span>
                  <span className="drawer-plant-name">{plant.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Interactive Inspector */}
          <div className="sidebar-panel inspector-card">
            <h2>
              <Info size={18} /> Cell Synergy Inspector
            </h2>

            {selectedCell && inspectorPlantInfo ? (
              <div className="inspector-content animate-fade-in">
                <div className="inspector-header">
                  <div className="inspector-title">
                    <span>{inspectorPlantInfo.icon}</span>
                    <h3>{inspectorPlantName}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--theme-text-muted)' }}>
                      [{selectedCell.r + 1}, {selectedCell.c + 1}]
                    </span>
                  </div>
                  <span className="inspector-category">{inspectorPlantInfo.category}</span>
                </div>

                {/* List of companion/combatant bonds with neighbors */}
                {inspectorRelationships.companions.length === 0 && inspectorRelationships.combatants.length === 0 ? (
                  <div className="inspector-empty">
                    <p style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>
                      No active companion connections with adjacent grid cells. Add neighbor crops to analyze synergies.
                    </p>
                  </div>
                ) : (
                  <div className="relationship-list">
                    {inspectorRelationships.companions.map((rel, i) => (
                      <div key={`comp-${i}`} className="rel-item rel-companion">
                        <div className="rel-plant-header">
                          <span>{rel.icon} {rel.name} ({rel.dir})</span>
                          <span className="rel-status-text companion">Synergy</span>
                        </div>
                        <p className="rel-desc">{rel.details}</p>
                      </div>
                    ))}
                    {inspectorRelationships.combatants.map((rel, i) => (
                      <div key={`comb-${i}`} className="rel-item rel-conflict">
                        <div className="rel-plant-header">
                          <span>{rel.icon} {rel.name} ({rel.dir})</span>
                          <span className="rel-status-text conflict">Warning</span>
                        </div>
                        <p className="rel-desc">{rel.details}</p>
                      </div>
                    ))}
                  </div>
                )}

                <button 
                  className="btn btn-danger btn-remove-selected"
                  onClick={() => handleRemovePlant(selectedCell.r, selectedCell.c)}
                >
                  <Trash2 size={14} style={{ marginInlineEnd: '0.35rem', verticalAlign: 'middle' }} /> 
                  Dig Up Crop
                </button>
              </div>
            ) : (
              <div className="inspector-empty">
                <HelpCircle size={32} className="inspector-empty-icon" />
                <p>Click any crop in your grid plot to diagnose neighboring companion relations or check compatibility details.</p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ── BOTTOM EDUCATIONAL CARD ── */}
      <section className="educational-section" style={{ marginTop: '2rem' }}>
        <div className="educational-card">
          <h2>
            <Lightbulb size={20} style={{ color: 'var(--theme-primary)' }} /> Companion Planting Principles
          </h2>
          <div className="edu-grid">
            <div className="edu-item">
              <h3>🦟 Pest Repellent Scents</h3>
              <p>Highly aromatic plants (like Herbs and Marigolds) produce essential oils that mask the scent of host plants from searching pests or actively repel them.</p>
            </div>
            <div className="edu-item">
              <h3>🧬 Nitrogen Enrichment</h3>
              <p>Legumes and certain clover species fix atmospheric nitrogen in the soil, feeding heavy foliage producers like leafy greens and corn planted nearby.</p>
            </div>
            <div className="edu-item">
              <h3>🎋 Structural Supports</h3>
              <p>Tall, sturdy crops (like Corn) act as a natural trellis support for climbing plants (like Cucumbers or Beans), optimizing garden vertical space.</p>
            </div>
            <div className="edu-item">
              <h3>🌿 Living Mulch Groundcover</h3>
              <p>Low-growing spreading plants cover the soil surface, cooling root zones, conserving moisture, and suppressing weeds for taller neighbors.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Planner;
