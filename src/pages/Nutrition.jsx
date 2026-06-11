import { useState } from 'react';
import { Droplets, Sun, Search, Filter } from 'lucide-react';
import { plantsData } from '../data/plants';
import './Nutrition.css';

const Nutrition = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Herbs'];

  const filteredCrops = plantsData.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || crop.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="nutrition-container animate-fade-in">
      <div className="nutrition-header">
        <h1 className="nutrition-title">Crop <span className="text-gradient">Nutrition Guide</span></h1>
        <p className="nutrition-subtitle">Discover the precise NPK requirements and environmental needs for optimal yields.</p>
      </div>

      <div className="search-bar glass-panel">
        <Search className="search-icon" />
        <input 
          type="text" 
          placeholder="Search for a crop (e.g., Tomato, Lemon)..." 
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="category-filters">
        <Filter className="filter-icon" />
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="crops-grid">
        {filteredCrops.length > 0 ? (
          filteredCrops.map((crop) => (
            <div key={crop.id} className="crop-card glass-panel">
              <div className="crop-header">
                <h2>{crop.name}</h2>
                <div className="crop-badges">
                  <span className="category-badge">{crop.category}</span>
                  <span className="ph-badge">pH {crop.ph}</span>
                </div>
              </div>
              
              <div className="npk-section">
                <div className="npk-item">
                  <div className="npk-circle n">N</div>
                  <span className="npk-value">{crop.n}</span>
                </div>
                <div className="npk-item">
                  <div className="npk-circle p">P</div>
                  <span className="npk-value">{crop.p}</span>
                </div>
                <div className="npk-item">
                  <div className="npk-circle k">K</div>
                  <span className="npk-value">{crop.k}</span>
                </div>
              </div>

              <div className="env-section">
                <div className="env-item">
                  <Droplets className="env-icon water-icon" />
                  <span>{crop.water}</span>
                </div>
                <div className="env-item">
                  <Sun className="env-icon sun-icon" />
                  <span>{crop.sunlight}</span>
                </div>
              </div>

              <div className="care-details-section">
                <div className="detail-item">
                  <span className="detail-label">🌱 Season:</span>
                  <span className="detail-text">{crop.season}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">🧪 Fertilizer:</span>
                  <span className="detail-text">{crop.fertilizer}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">✂️ Care Tips:</span>
                  <span className="detail-text">{crop.care}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No crops found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nutrition;
