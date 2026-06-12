import { useState, useEffect, useRef } from 'react';
import {
  Gamepad2, Sprout, Flower, Carrot, Droplets, FlaskConical, Sun,
  Heart, TrendingUp, Circle, Leaf, TreePine, RefreshCcw
} from 'lucide-react';
import './Sandbox.css';

export default function Sandbox() {
  const [seedType, setSeedType] = useState(null); // 'flower', 'vegetable', 'tree'
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'gameover', 'won'
  
  // Plant Stats
  const [stage, setStage] = useState(0); // 0: Seed, 1: Sprout, 2: Vegetative, 3: Mature
  const [health, setHealth] = useState(100);
  const [growth, setGrowth] = useState(0);
  
  // Resources
  const [moisture, setMoisture] = useState(50);
  const [nutrients, setNutrients] = useState(50);
  const [sunlight, setSunlight] = useState(50);

  // Weather Animations
  const [isRaining, setIsRaining] = useState(false);
  const [isSunning, setIsSunning] = useState(false);
  const [isFerting, setIsFerting] = useState(false);

  // Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setMoisture(prev => Math.max(0, prev - 2));
      setNutrients(prev => Math.max(0, prev - 1.5));
      setSunlight(prev => Math.max(0, prev - 2.5));

      let healthDelta = 0;
      let growthDelta = 0;
      let inSweetSpot = true;

      // Evaluate Moisture
      if (moisture < 20 || moisture > 85) { healthDelta -= 4; inSweetSpot = false; }
      else if (moisture >= 40 && moisture <= 80) growthDelta += 1;

      // Evaluate Nutrients
      if (nutrients < 20 || nutrients > 85) { healthDelta -= 3; inSweetSpot = false; }
      else if (nutrients >= 40 && nutrients <= 80) growthDelta += 1;

      // Evaluate Sunlight
      if (sunlight < 20 || sunlight > 85) { healthDelta -= 4; inSweetSpot = false; }
      else if (sunlight >= 40 && sunlight <= 80) growthDelta += 1;

      // Apply changes
      setHealth(prev => {
        const newHealth = Math.min(100, Math.max(0, prev + (inSweetSpot ? 2 : healthDelta)));
        if (newHealth <= 0) setGameState('gameover');
        return newHealth;
      });

      if (inSweetSpot) {
        setGrowth(prev => {
          const newGrowth = prev + growthDelta * 2;
          if (newGrowth >= 100) {
            setStage(s => {
              if (s >= 2) {
                setGameState('won');
                return 3;
              }
              return s + 1;
            });
            return 0; // Reset growth for next stage
          }
          return newGrowth;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, moisture, nutrients, sunlight]);

  // Actions
  const handleWater = () => {
    setMoisture(prev => Math.min(100, prev + 25));
    setIsRaining(true);
    setTimeout(() => setIsRaining(false), 2000);
  };

  const handleFertilize = () => {
    setNutrients(prev => Math.min(100, prev + 25));
    setIsFerting(true);
    setTimeout(() => setIsFerting(false), 2000);
  };

  const handleSun = () => {
    setSunlight(prev => Math.min(100, prev + 25));
    setIsSunning(true);
    setTimeout(() => setIsSunning(false), 2000);
  };

  const resetGame = () => {
    setSeedType(null);
    setGameState('menu');
    setStage(0);
    setHealth(100);
    setGrowth(0);
    setMoisture(50);
    setNutrients(50);
    setSunlight(50);
  };

  const renderPlantIcon = () => {
    if (stage === 0) return <Circle className="plant-icon" size={48} fill="currentColor" />;
    if (stage === 1) return <Sprout className="plant-icon" size={48} />;
    if (stage === 2) return <Leaf className="plant-icon" size={48} fill="currentColor" />;
    
    // Stage 3 Mature
    if (seedType === 'flower') return <Flower className="plant-icon" size={48} fill="currentColor" />;
    if (seedType === 'vegetable') return <Carrot className="plant-icon" size={48} fill="currentColor" />;
    return <TreePine className="plant-icon" size={48} fill="currentColor" />;
  };

  const getStageName = () => {
    const stages = ['Seed', 'Sprout', 'Vegetative', 'Mature'];
    return stages[stage];
  };

  return (
    <div className="sandbox-container animate-fade-in">
      <div className="sandbox-header">
        <h1 className="sandbox-title">
          <Gamepad2 size={32} />
          Virtual Plant <span className="text-gradient">Sandbox</span>
        </h1>
        <p className="sandbox-subtitle">Balance moisture, nutrients, and sunlight to evolve your digital pet.</p>
      </div>

      {gameState === 'menu' && (
        <div className="seed-selection animate-fade-in">
          <div className="glass-card seed-card" onClick={() => { setSeedType('flower'); setGameState('playing'); }}>
            <div className="seed-icon-wrap"><Flower size={40} /></div>
            <h3>Flower Seed</h3>
            <p className="text-sm text-muted">A beautiful blooming flora.</p>
          </div>
          <div className="glass-card seed-card" onClick={() => { setSeedType('vegetable'); setGameState('playing'); }}>
            <div className="seed-icon-wrap"><Carrot size={40} /></div>
            <h3>Vegetable Seed</h3>
            <p className="text-sm text-muted">A nutritious garden crop.</p>
          </div>
          <div className="glass-card seed-card" onClick={() => { setSeedType('tree'); setGameState('playing'); }}>
            <div className="seed-icon-wrap"><TreePine size={40} /></div>
            <h3>Tree Seed</h3>
            <p className="text-sm text-muted">A sturdy sapling.</p>
          </div>
        </div>
      )}

      {gameState !== 'menu' && (
        <div className="game-layout animate-fade-in">
          {/* Main Stage View */}
          <div className="glass-card game-stage-card">
            <div className={`weather-layer rain-layer ${isRaining ? 'active' : ''}`}></div>
            <div className={`weather-layer sun-layer ${isSunning ? 'active' : ''}`}></div>
            <div className={`weather-layer fert-layer ${isFerting ? 'active' : ''}`}></div>

            <div className="sky-area"></div>
            
            <div className={`plant-entity stage-${stage} type-${seedType} ${health > 0 ? 'plant-sway' : ''}`}>
              <div className="plant-status-floating">{getStageName()} Stage</div>
              {renderPlantIcon()}
            </div>

            <div className="ground-area"></div>

            {gameState === 'gameover' && (
              <div className="game-over-overlay animate-fade-in">
                <h2>Game Over!</h2>
                <p>Your plant withered away due to poor resource management.</p>
                <button className="btn btn-primary mt-4" onClick={resetGame}>
                  <RefreshCcw size={16} /> Try Again
                </button>
              </div>
            )}

            {gameState === 'won' && (
              <div className="game-over-overlay animate-fade-in" style={{ background: 'rgba(16, 185, 129, 0.8)' }}>
                <h2 style={{ color: '#fff' }}>Magnificent!</h2>
                <p>Your plant has reached full maturity. Masterful gardening!</p>
                <button className="btn btn-secondary mt-4" onClick={resetGame}>
                  <RefreshCcw size={16} /> Play Again
                </button>
              </div>
            )}
          </div>

          {/* HUD / Controls Panel */}
          <div className="glass-card hud-panel">
            <h3><TrendingUp size={18} /> Telemetry</h3>
            
            {/* Health Bar */}
            <div className="stat-group">
              <div className="stat-header">
                <span><Heart size={14} /> Vitality</span>
                <span>{Math.round(health)}%</span>
              </div>
              <div className="stat-bar-bg">
                <div 
                  className={`stat-bar-fill health ${health < 30 ? 'critical' : health < 60 ? 'warning' : ''}`} 
                  style={{ width: `${health}%` }}
                ></div>
              </div>
            </div>

            {/* Growth Bar */}
            <div className="stat-group" style={{ marginBottom: '1rem' }}>
              <div className="stat-header">
                <span><Sprout size={14} /> Stage Progress</span>
                <span>{Math.round(growth)}%</span>
              </div>
              <div className="stat-bar-bg" style={{ height: '6px', background: 'var(--theme-border)' }}>
                <div className="stat-bar-fill" style={{ width: `${growth}%`, background: '#f472b6' }}></div>
              </div>
            </div>

            <hr className="divider" />
            <p className="text-xs text-muted mb-2">Keep resources in the highlighted target zone (40-80%) for optimal growth.</p>

            {/* Resource: Moisture */}
            <div className="stat-group">
              <div className="stat-header">
                <span><Droplets size={14} /> Moisture</span>
                <span>{Math.round(moisture)}%</span>
              </div>
              <div className="stat-bar-bg">
                <div className="stat-bar-fill moisture" style={{ width: `${moisture}%` }}></div>
                <div className="ideal-range-marker"></div>
              </div>
            </div>

            {/* Resource: Nutrients */}
            <div className="stat-group">
              <div className="stat-header">
                <span><FlaskConical size={14} /> Nutrients</span>
                <span>{Math.round(nutrients)}%</span>
              </div>
              <div className="stat-bar-bg">
                <div className="stat-bar-fill nutrients" style={{ width: `${nutrients}%` }}></div>
                <div className="ideal-range-marker"></div>
              </div>
            </div>

            {/* Resource: Sunlight */}
            <div className="stat-group">
              <div className="stat-header">
                <span><Sun size={14} /> Sunlight</span>
                <span>{Math.round(sunlight)}%</span>
              </div>
              <div className="stat-bar-bg">
                <div className="stat-bar-fill sunlight" style={{ width: `${sunlight}%` }}></div>
                <div className="ideal-range-marker"></div>
              </div>
            </div>

            {/* Interactive Actions */}
            <div className="controls-grid">
              <button className="action-btn btn-water" onClick={handleWater} disabled={gameState !== 'playing'}>
                <Droplets size={18} /> Water Plant
              </button>
              <button className="action-btn btn-fert" onClick={handleFertilize} disabled={gameState !== 'playing'}>
                <FlaskConical size={18} /> Add Fertilizer
              </button>
              <button className="action-btn btn-sun" onClick={handleSun} disabled={gameState !== 'playing'}>
                <Sun size={18} /> Sun Lamp
              </button>
            </div>
            
            <button className="btn btn-secondary btn-sm" style={{ marginTop: 'auto' }} onClick={resetGame}>
              Abandon Plant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
