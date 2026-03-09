import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@300;400;500;600&display=swap');

  :root {
    --brown-900 : #1c0f05;
    --brown-800 : #2e1a0e;
    --brown-700 : #4a2c1a;
    --brown-500 : #7a4f35;
    --brown-300 : #b8926a;
    --brown-100 : #e8d5c0;
    --brown-50  : #f5ede3;
    --cream     : #fdf8f2;
    --white     : #ffffff;
    --terra     : #c0522a;
    --terra-bg  : #fdf0eb;
    --green     : #2d6a4f;
    --border    : #ddd0c0;
    --serif     : 'Cormorant Garamond', Georgia, serif;
    --sans      : 'Outfit', sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--cream); font-family: var(--sans); }

  .al-page {
    min-height : 100vh;
    display    : flex;
    flex-direction: column;
  }

  .al-topbar {
    background: var(--brown-900);
    padding   : 0 48px;
    height    : 56px;
    display   : flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 3px solid var(--terra);
  }
  .al-topbar-brand {
    font-family   : var(--serif);
    font-size     : 20px;
    font-weight   : 700;
    color         : var(--cream);
    letter-spacing: 0.3px;
  }
  .al-topbar-brand span { color: var(--brown-300); margin-right: 10px; }
  .al-topbar-right {
    font-size  : 12px;
    color      : var(--brown-300);
    font-family: var(--sans);
  }

  .al-body {
    flex           : 1;
    display        : flex;
    align-items    : center;
    justify-content: center;
    padding        : 48px 24px;
    background     : var(--cream);
  }

  .al-card {
    width        : 100%;
    max-width    : 400px;
    background   : var(--white);
    border       : 1.5px solid var(--border);
    border-radius: 14px;
    overflow     : hidden;
    box-shadow   : 0 8px 32px rgba(28,15,5,0.1);
    animation    : fadeUp 0.4s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  .al-card-top {
    background : var(--brown-900);
    padding    : 32px 28px;
    text-align : center;
    position   : relative;
    overflow   : hidden;
    border-bottom: 3px solid var(--terra);
  }
  .al-card-top::before {
    content      : '🔐';
    position     : absolute;
    top: -20px; right: -10px;
    font-size    : 100px;
    opacity      : 0.05;
    pointer-events: none;
  }
  .al-card-icon {
    width          : 52px;
    height         : 52px;
    border-radius  : 12px;
    background     : rgba(192,82,42,0.2);
    border         : 1.5px solid rgba(192,82,42,0.4);
    display        : flex;
    align-items    : center;
    justify-content: center;
    font-size      : 22px;
    margin         : 0 auto 16px;
  }
  .al-card-title {
    font-family: var(--serif);
    font-size  : 26px;
    font-weight: 700;
    color      : var(--cream);
    margin-bottom: 6px;
  }
  .al-card-sub {
    font-size  : 13px;
    color      : var(--brown-300);
    font-weight: 300;
  }

  .al-card-body { padding: 28px; }

  .al-field { margin-bottom: 20px; }
  .al-field-label {
    display       : block;
    font-size     : 11px;
    font-weight   : 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color         : var(--brown-700);
    margin-bottom : 8px;
  }
  .al-input {
    width        : 100%;
    border       : 1.5px solid var(--border);
    border-radius: 8px;
    padding      : 12px 14px;
    font-family  : var(--sans);
    font-size    : 14px;
    color        : var(--brown-900);
    background   : var(--cream);
    outline      : none;
    transition   : border-color 0.2s, box-shadow 0.2s;
  }
  .al-input:focus {
    border-color: var(--brown-500);
    box-shadow  : 0 0 0 3px rgba(122,79,53,0.1);
    background  : var(--white);
  }
  .al-input::placeholder { color: var(--brown-300); }

  .al-error {
    background   : var(--terra-bg);
    border       : 1.5px solid rgba(192,82,42,0.3);
    border-radius: 8px;
    padding      : 10px 14px;
    font-size    : 13px;
    color        : var(--terra);
    margin-bottom: 16px;
    display      : flex;
    align-items  : center;
    gap          : 8px;
  }

  .al-btn {
    width         : 100%;
    background    : var(--brown-900);
    color         : var(--cream);
    border        : none;
    border-radius : 8px;
    padding       : 13px;
    font-family   : var(--sans);
    font-size     : 14px;
    font-weight   : 600;
    letter-spacing: 0.5px;
    cursor        : pointer;
    transition    : background 0.2s, transform 0.1s, box-shadow 0.2s;
  }
  .al-btn:hover:not(:disabled) {
    background: var(--terra);
    transform : translateY(-1px);
    box-shadow: 0 4px 16px rgba(192,82,42,0.3);
  }
  .al-btn:disabled { background: var(--brown-300); cursor: not-allowed; }

  .al-back {
    text-align : center;
    margin-top : 16px;
    font-size  : 12px;
    color      : var(--brown-300);
  }
  .al-back a {
    color          : var(--brown-500);
    text-decoration: none;
    font-weight    : 500;
  }
  .al-back a:hover { color: var(--terra); }

  .al-footer {
    border-top : 1.5px solid var(--border);
    background : var(--white);
    padding    : 14px 48px;
    text-align : center;
    font-size  : 11px;
    color      : var(--brown-300);
  }
`;

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const navigate = useNavigate();

  async function handleLogin() {
    if (!password.trim()) { setError('Please enter the admin password.'); return; }
    setError('');
    setLoading(true);
    try {
      const res  = await fetch('http://localhost:5000/auth/login', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Incorrect password.'); return; }

      // save token in memory (sessionStorage)
      sessionStorage.setItem('admin_token', data.token);
      navigate('/admin/dashboard');
    } catch {
      setError('Cannot connect to server. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{css}</style>
      <div className="al-page">

        <div className="al-topbar">
          <div className="al-topbar-brand"><span>🎓</span>Campus Grievance Portal</div>
          <div className="al-topbar-right">Admin Access</div>
        </div>

        <div className="al-body">
          <div className="al-card">

            <div className="al-card-top">
              <div className="al-card-icon">🔐</div>
              <div className="al-card-title">Admin Login</div>
              <div className="al-card-sub">Enter your password to access the dashboard</div>
            </div>

            <div className="al-card-body">
              {error && <div className="al-error"><span>⚠</span>{error}</div>}

              <div className="al-field">
                <label className="al-field-label">Admin Password</label>
                <input
                  className="al-input"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>

              <button className="al-btn" onClick={handleLogin} disabled={loading}>
                {loading ? 'Logging in...' : 'Login to Dashboard →'}
              </button>

              <div className="al-back">
                <a href="/">← Back to Student Portal</a>
              </div>
            </div>

          </div>
        </div>

        <div className="al-footer">
          Campus Grievance Portal · Admin Access Only · All actions are logged
        </div>

      </div>
    </>
  );
}
