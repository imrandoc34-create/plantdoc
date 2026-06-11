import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Disease from './pages/Disease';
import Nutrition from './pages/Nutrition';
import Ideas from './pages/Ideas';
import Treatments from './pages/Treatments';
import Calendar from './pages/Calendar';
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
            <Route path="/ideas" element={<Ideas />} />
            <Route path="/treatments" element={<Treatments />} />
            <Route path="/calendar" element={<Calendar />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
