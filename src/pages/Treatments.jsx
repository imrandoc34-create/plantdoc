import { useState } from 'react';
import { ShieldPlus, Search, Filter } from 'lucide-react';
import { treatmentsData, treatmentCategories } from '../data/treatments';
import './Treatments.css';

const typeBadgeClass = {
  Organic: 'organic',
  Synthetic: 'synthetic',
  Biological: 'biological',
  Specialty: 'specialty',
  Traditional: 'traditional',
};

const Treatments = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = treatmentsData.filter(t => {
    const matchCat = activeCategory === 'All' || t.category === activeCategory;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase())
      || t.target.toLowerCase().includes(search.toLowerCase())
      || t.plants.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="treatments-container animate-fade-in">
      <div className="treatments-header">
        <h1 className="treatments-title">Global Treatment <span className="text-gradient">Library</span></h1>
        <p className="treatments-subtitle">
          65 treatments worldwide — organic, synthetic, biological, traditional, and specialty.
          Search by name, target disease, or plant.
        </p>
      </div>

      {/* Search */}
      <div className="search-bar glass-panel">
        <Search className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search treatments, diseases, or plants (e.g. Aphids, Tomato)…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Category filter */}
      <div className="t-category-scroll">
        <Filter className="filter-icon" size={18} />
        {treatmentCategories.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="result-count">{filtered.length} treatment{filtered.length !== 1 ? 's' : ''} found</p>

      {/* Grid */}
      <div className="treatments-grid">
        {filtered.length === 0 ? (
          <div className="no-results">No treatments found matching your search.</div>
        ) : filtered.map(treatment => (
          <div key={treatment.id} className="treatment-card glass-panel">
            <div className="treatment-card-header">
              <h2>{treatment.name}</h2>
              <div className="t-badges">
                <span className={`type-badge ${typeBadgeClass[treatment.type] || 'specialty'}`}>{treatment.type}</span>
              </div>
            </div>

            <div className="t-category-tag">{treatment.category}</div>

            <div className="target-section">
              <ShieldPlus className="target-icon" size={16} />
              <span className="target-label">Treats: </span>
              <span className="target-text">{treatment.target}</span>
            </div>

            <p className="treatment-desc">{treatment.description}</p>

            <div className="usage-box">
              <span className="usage-label">🧪 How to Use:</span>
              <p>{treatment.usage}</p>
            </div>

            <div className="plants-box">
              <span className="plants-label">🌿 Effective on:</span>
              <p>{treatment.plants}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Treatments;
