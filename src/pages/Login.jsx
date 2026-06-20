import { useState } from 'react';
import { Sprout, User, Lock, ArrowRight, Loader2 } from 'lucide-react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both Farmer ID and Password.');
      return;
    }

    setIsLoading(true);

    // Mock authentication delay
    setTimeout(() => {
      setIsLoading(false);
      // Save farmer profile data for the Profile page
      const profileData = {
        farmerId: email,
        loginTime: new Date().toISOString(),
        farmName: `${email}'s Farm`,
        region: 'India',
        role: 'Farmer',
        accountStatus: 'Active',
      };
      localStorage.setItem('plantdoc-farmer-profile', JSON.stringify(profileData));
      onLogin(); // Trigger login success
    }, 1200);
  };

  return (
    <div className="login-container">
      <div className="login-glass-card">
        <div className="login-header">
          <div className="login-icon-wrapper">
            <Sprout size={32} className="login-icon" />
          </div>
          <h1 className="login-title">Farm Diagnostics</h1>
          <p className="login-subtitle">Sign in to access your crop intelligence and health analytics dashboard.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div style={{ color: '#f87171', fontSize: '0.875rem', textAlign: 'center', backgroundColor: 'rgba(248, 113, 113, 0.1)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(248, 113, 113, 0.2)' }}>{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Farmer ID / Email</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                id="email"
                type="text"
                className="login-input"
                placeholder="e.g. farm-482"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Security PIN / Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                className="login-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="forgot-password">
            <span className="forgot-link">Recover Access?</span>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={20} className="spinner" />
                Authenticating...
              </>
            ) : (
              <>
                Sign In to Dashboard <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          Don't have an account? 
          <span className="register-link">Register Farm</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
