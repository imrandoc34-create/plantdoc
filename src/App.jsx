import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Disease from './pages/Disease';
import Nutrition from './pages/Nutrition';
import Treatments from './pages/Treatments';
import Calendar from './pages/Calendar';
import Planner from './pages/Planner';
import Sandbox from './pages/Sandbox';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/disease" element={<Disease />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/treatments" element={<Treatments />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/sandbox" element={<Sandbox />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
