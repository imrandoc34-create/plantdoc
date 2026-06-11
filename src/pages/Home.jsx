import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Sprout } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container animate-fade-in">
      <section className="hero-section">
        <h1 className="hero-title">
          Intelligent <span className="text-gradient">Plant Care</span> for Modern Farmers
        </h1>
        <p className="hero-subtitle">
          Instantly identify plant diseases and discover optimal crop nutrition. Protect your harvest with advanced insights.
        </p>
        <div className="hero-actions">
          <Link to="/disease" className="btn btn-primary">
            <Activity className="btn-icon" />
            Scan Disease
            <ArrowRight className="btn-icon-right" />
          </Link>
          <Link to="/nutrition" className="btn btn-secondary glass-panel">
            <Sprout className="btn-icon" />
            Nutrition Guide
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
