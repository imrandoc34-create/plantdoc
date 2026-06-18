import { Link, useLocation } from 'react-router-dom';
import { Leaf, Stethoscope, Droplets, Lightbulb, ShieldPlus, CalendarDays, LayoutGrid, Gamepad2, History } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <header className="navbar glass-panel">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand desktop-only">
          <Leaf className="brand-icon" />
          <span className="text-gradient font-bold">Plant Doc</span>
        </Link>
        <nav className="navbar-nav">
          <Link to="/" className={`nav-link mobile-only ${isActive('/')}`}>
            <Leaf className="nav-icon" />
            <span>Home</span>
          </Link>
          <Link to="/disease" className={`nav-link ${isActive('/disease')}`}>
            <Stethoscope className="nav-icon" />
            <span>Scanner</span>
          </Link>
          <Link to="/timeline" className={`nav-link ${isActive('/timeline')}`}>
            <History className="nav-icon" />
            <span>Timeline</span>
          </Link>
          <Link to="/treatments" className={`nav-link ${isActive('/treatments')}`}>
            <ShieldPlus className="nav-icon" />
            <span>Treatments</span>
          </Link>
          <Link to="/nutrition" className={`nav-link ${isActive('/nutrition')}`}>
            <Droplets className="nav-icon" />
            <span>Nutrition</span>
          </Link>
          <Link to="/calendar" className={`nav-link ${isActive('/calendar')}`}>
            <CalendarDays className="nav-icon" />
            <span>Calendar</span>
          </Link>
          <Link to="/ideas" className={`nav-link ${isActive('/ideas')}`}>
            <Lightbulb className="nav-icon" />
            <span>Ideas</span>
          </Link>
          <Link to="/planner" className={`nav-link ${isActive('/planner')}`}>
            <LayoutGrid className="nav-icon" />
            <span>Planner</span>
          </Link>
          <Link to="/sandbox" className={`nav-link ${isActive('/sandbox')}`}>
            <Gamepad2 className="nav-icon" />
            <span>Sandbox</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
