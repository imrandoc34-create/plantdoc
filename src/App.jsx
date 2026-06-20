import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Disease from './pages/Disease';
import Nutrition from './pages/Nutrition';
import Treatments from './pages/Treatments';
import Calendar from './pages/Calendar';
import Planner from './pages/Planner';
import Sandbox from './pages/Sandbox';
import Timeline from './pages/Timeline';
import Ideas from './pages/Ideas';
import Login from './pages/Login';
import Profile from './pages/Profile';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('plantdoc-auth') === 'true';
  });

  const handleLogin = () => {
    localStorage.setItem('plantdoc-auth', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('plantdoc-auth');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="app-container">
          <Navbar onLogout={handleLogout} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/disease" element={<Disease />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/treatments" element={<Treatments />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/sandbox" element={<Sandbox />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/ideas" element={<Ideas />} />
              <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
            </Routes>
          </main>
        </div>
      )}
    </Router>
  );
}

export default App;
