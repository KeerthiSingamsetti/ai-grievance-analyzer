import { useState } from 'react';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --page-bg  : #f8f3ee;
    --card-bg  : #fdf6ee;
    --white    : #ffffff;
    --text-main: #2a1508;
    --text-sub : #5c3d2a;
    --text-mute: #8a6550;
    --text-hint: #b89080;
    --border   : #e0cfc0;
    --border-lt: #ede0d0;
    --nav-bg   : #2a1508;
    --terra    : #b84a20;
    --terra-lt : #fdf0eb;
    --green    : #1a5c36;
    --green-lt : #e4f4ec;
    --blue     : #1a3a6b;
    --blue-lt  : #e4eef8;
    --amber    : #b45309;
    --amber-lt : #fef3c7;
    --serif    : 'Playfair Display', Georgia, serif;
    --sans     : 'DM Sans', sans-serif;
    --mono     : 'DM Mono', monospace;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--page-bg); font-family: var(--sans); color: var(--text-main); min-height: 100vh; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }
  @keyframes rise  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  .nav {
    height: 62px; background: var(--nav-bg);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px; border-bottom: 2px solid var(--terra);
    position: sticky; top: 0; z-index: 100;
  }
  .nav-brand { display: flex; align-items: center; gap: 11px; }
  .nav-mark {
    width: 32px; height: 32px; border-radius: 7px;
    background: linear-gradient(135deg, var(--terra) 0%, #8c5a3c 100%);
    display: flex; align-items: center; justify-content: center; font-size: 15px;
  }
  .nav-name { font-family: var(--serif); font-size: 16px; color: #f8f3ee; }
  .nav-links { display: flex; gap: 4px; }
  .nav-link {
    padding: 6px 14px; border-radius: 6px;
    font-size: 13px; font-weight: 500; text-decoration: none;
    color: #b07850; transition: all 0.18s;
  }
  .nav-link:hover { background: rgba(255,255,255,0.07); color: #f8f3ee; }
  .nav-link.active { background: rgba(184,74,32,0.2); color: #e8622e; }

  .hero {
    background: var(--nav-bg); padding: 48px 48px 44px;
    border-bottom: 3px solid var(--terra); position: relative; overflow: hidden;
  }
  .hero::after {
    content: ''; position: absolute; top: -100px; right: -100px;
    width: 420px; height: 420px; border-radius: 50%;
    background: radial-gradient(circle, rgba(184,74,32,0.09) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-tag {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(184,74,32,0.14); border: 1px solid rgba(184,74,32,0.28);
    border-radius: 4px; padding: 5px 12px;
    font-family: var(--mono); font-size: 10px; letter-spacing: 2px;
    color: #e8622e; text-transform: uppercase; margin-bottom: 16px;
  }
  .hero-dot { width: 5px; height: 5px; border-radius: 50%; background: #e8622e; animation: blink 2s infinite; }
  .hero-title {
    font-family: var(--serif); font-size: 50px; font-weight: 800;
    color: #f8f3ee; line-height: 1.08; letter-spacing: -0.5px; margin-bottom: 14px;
  }
  .hero-title em { font-style: italic; color: #d4aa88; }
  .hero-desc { font-size: 15px; font-weight: 300; color: #a07858; line-height: 1.75; max-width: 460px; }

  .main { max-width: 820px; width: 100%; margin: 0 auto; padding: 48px 24px 64px; }

  .section-label {
    display: flex; align-items: center; gap: 10px;
    font-family: var(--mono); font-size: 10px; letter-spacing: 2.5px;
    text-transform: uppercase; color: var(--text-mute); margin-bottom: 18px;
  }
  .section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .error-box {
    background: var(--terra-lt); border: 1.5px solid rgba(184,74,32,0.25);
    border-left: 4px solid var(--terra); border-radius: 8px;
    padding: 13px 16px; font-size: 14px; color: var(--terra);
    display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
  }

  /* FORM CARD */
  .form-card {
    background: var(--card-bg); border: 1.5px solid var(--border);
    border-radius: 16px; overflow: hidden;
    box-shadow: 0 2px 24px rgba(42,21,8,0.07);
  }

  /* 2-col row */
  .field-row {
    display: grid; grid-template-columns: 1fr 1fr;
    border-bottom: 1.5px solid var(--border-lt);
  }
  .field {
    padding: 22px 26px; border-right: 1.5px solid var(--border-lt);
  }
  .field:last-child { border-right: none; }

  /* full-width field */
  .field-full { padding: 22px 26px; border-bottom: 1.5px solid var(--border-lt); }
  .field-full:last-of-type { border-bottom: none; }

  .field-label {
    display: block;
    font-family: var(--mono); font-size: 11px; letter-spacing: 1.5px;
    text-transform: uppercase; color: var(--text-sub); font-weight: 500; margin-bottom: 9px;
  }
  .field-label span { color: var(--terra); margin-left: 2px; }
  .field-label small {
    font-family: var(--sans); font-size: 11px; letter-spacing: 0;
    text-transform: none; color: var(--text-hint); font-weight: 400; margin-left: 6px;
  }

  .field-input {
    width: 100%; background: var(--white); border: 1.5px solid var(--border);
    border-radius: 8px; padding: 12px 14px;
    font-family: var(--sans); font-size: 15px; font-weight: 400;
    color: var(--text-main); outline: none; transition: all 0.18s;
  }
  .field-input:focus { border-color: #8c5a3c; box-shadow: 0 0 0 3px rgba(140,90,60,0.1); }
  .field-input::placeholder { color: var(--text-hint); }

  .field-textarea {
    width: 100%; background: var(--white); border: 1.5px solid var(--border);
    border-radius: 8px; padding: 13px 14px;
    font-family: var(--sans); font-size: 15px; font-weight: 400;
    color: var(--text-main); outline: none; resize: vertical;
    min-height: 160px; line-height: 1.75; transition: all 0.18s;
  }
  .field-textarea:focus { border-color: #8c5a3c; box-shadow: 0 0 0 3px rgba(140,90,60,0.1); }
  .field-textarea::placeholder { color: var(--text-hint); }

  /* char count */
  .char-count {
    text-align: right; font-family: var(--mono); font-size: 11px;
    color: var(--text-hint); margin-top: 6px;
  }
  .char-count.warn { color: var(--terra); }

  .card-footer {
    padding: 18px 26px; background: var(--white);
    border-top: 1.5px solid var(--border-lt);
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
  }
  .card-footer-note { font-size: 12px; color: var(--text-hint); font-family: var(--mono); }

  .submit-btn {
    background: var(--nav-bg); color: #f8f3ee; border: none; border-radius: 8px;
    padding: 13px 30px; font-family: var(--sans); font-size: 15px; font-weight: 600;
    cursor: pointer; transition: all 0.18s; display: flex; align-items: center; gap: 8px; white-space: nowrap;
  }
  .submit-btn:hover:not(:disabled) { background: var(--terra); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(184,74,32,0.3); }
  .submit-btn:disabled { background: var(--text-hint); cursor: not-allowed; }

  /* LOADING */
  .loading { text-align: center; padding: 72px 20px; }
  .spinner { width: 38px; height: 38px; border: 3px solid var(--border); border-top: 3px solid var(--terra); border-radius: 50%; animation: spin 0.75s linear infinite; margin: 0 auto 20px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-title { font-family: var(--serif); font-size: 22px; font-weight: 700; color: var(--text-main); margin-bottom: 6px; }
  .loading-sub { font-size: 13px; color: var(--text-mute); font-family: var(--mono); }

  /* SUCCESS */
  .success { animation: rise 0.45s cubic-bezier(0.16,1,0.3,1) both; }
  .success-top {
    background: var(--green); border-radius: 14px 14px 0 0;
    padding: 32px 32px 28px; position: relative; overflow: hidden;
  }
  .success-top::before {
    content: '✓'; position: absolute; right: 20px; top: -10px;
    font-family: var(--serif); font-size: 150px; font-weight: 800;
    color: rgba(255,255,255,0.04); line-height: 1; pointer-events: none;
  }
  .success-icon {
    width: 52px; height: 52px; border-radius: 50%;
    background: rgba(255,255,255,0.15); border: 2px solid rgba(255,255,255,0.25);
    display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 18px;
  }
  .success-title { font-family: var(--serif); font-size: 30px; font-weight: 800; color: #fff; margin-bottom: 6px; }
  .success-sub { font-size: 14px; color: rgba(255,255,255,0.65); font-weight: 300; }
  .success-body {
    background: var(--card-bg); border: 1.5px solid var(--border); border-top: none;
    border-radius: 0 0 14px 14px; box-shadow: 0 4px 28px rgba(42,21,8,0.07);
  }
  .success-id-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 22px 26px; border-bottom: 1.5px solid var(--border-lt); background: var(--white);
  }
  .success-id-label { font-family: var(--mono); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-mute); margin-bottom: 6px; }
  .success-id-value { font-family: var(--mono); font-size: 26px; font-weight: 500; color: var(--text-main); letter-spacing: 2px; }
  .success-id-status { background: var(--amber-lt); border: 1.5px solid rgba(180,83,9,0.2); border-radius: 7px; padding: 8px 16px; font-family: var(--mono); font-size: 11px; color: var(--amber); letter-spacing: 1px; }
  .success-priority-row { padding: 16px 26px; display: flex; align-items: center; gap: 11px; font-size: 14px; font-weight: 500; border-bottom: 1.5px solid var(--border-lt); }
  .success-priority-row.high { background: rgba(184,74,32,0.05); color: var(--terra); }
  .success-priority-row.low  { background: rgba(26,92,54,0.05);  color: var(--green); }
  .priority-icon { width: 30px; height: 30px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
  .high .priority-icon { background: rgba(184,74,32,0.1); }
  .low  .priority-icon { background: rgba(26,92,54,0.1);  }
  .success-depts { padding: 22px 26px; }
  .success-depts-label { font-family: var(--mono); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--text-mute); margin-bottom: 13px; }
  .dept-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .dept-chip {
    display: flex; align-items: center; gap: 7px;
    background: var(--blue-lt); color: var(--blue);
    border: 1.5px solid rgba(26,58,107,0.15); border-radius: 8px;
    padding: 9px 14px; font-size: 14px; font-weight: 600; animation: rise 0.35s ease both;
  }
  .dept-chip-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--blue); }
  .new-btn {
    width: 100%; background: transparent; border: none; border-top: 1.5px solid var(--border-lt);
    padding: 16px; font-family: var(--sans); font-size: 14px; font-weight: 500;
    color: var(--text-mute); cursor: pointer; transition: all 0.18s;
  }
  .new-btn:hover { background: var(--white); color: var(--text-sub); }

  .footer { background: var(--nav-bg); padding: 18px 48px; display: flex; align-items: center; justify-content: space-between; }
  .footer-l { font-family: var(--mono); font-size: 11px; color: #5c3d2a; }
  .footer-r { display: flex; align-items: center; gap: 6px; font-family: var(--mono); font-size: 11px; color: #1a5c36; }
  .footer-dot { width: 6px; height: 6px; border-radius: 50%; background: #1a5c36; animation: blink 2s infinite; }

  @media(max-width:640px){
    .nav { padding: 0 20px; } .hero { padding: 36px 20px; } .hero-title { font-size: 34px; }
    .field-row { grid-template-columns: 1fr; }
    .field { border-right: none; border-bottom: 1.5px solid var(--border-lt); }
    .footer { padding: 14px 20px; flex-direction: column; gap: 8px; }
  }
`;

interface SuccessData {
  complaintId: string;
  departments_to_notify: string[];
  overall_priority: string;
}

export default function StudentPage() {
  const [name,      setName]      = useState('');
  const [rollNo,    setRollNo]    = useState('');
  const [title,     setTitle]     = useState('');
  const [desc,      setDesc]      = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState<SuccessData | null>(null);

  async function handleSubmit() {
    if (!name.trim())  { setError('Please enter your full name.');        return; }
    if (!rollNo.trim()){ setError('Please enter your student ID.');        return; }
    if (!title.trim()) { setError('Please enter a complaint title.');      return; }
    if (!desc.trim())  { setError('Please describe your complaint.');      return; }
    setError(''); setLoading(true);
    try {
      const res  = await fetch('http://localhost:5000/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text             : desc,
          name             : name,
          roll_no          : rollNo,
          complaint_title  : title,
        }),
      });
      const data = await res.json();
      setSuccess({
        complaintId          : data.complaintId || ('GRV-' + Math.floor(1000 + Math.random() * 9000)),
        departments_to_notify: data.departments_to_notify || [],
        overall_priority     : data.overall_priority || 'Low',
      });
    } catch {
      setError('Unable to connect to server. Make sure backend is running.');
    } finally { setLoading(false); }
  }

  function reset() { setName(''); setRollNo(''); setTitle(''); setDesc(''); setSuccess(null); setError(''); }
  const isHigh = success?.overall_priority === 'High';

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        <nav className="nav">
          <div className="nav-brand">
            <div className="nav-mark">🎓</div>
            <div className="nav-name">Campus Grievance Portal</div>
          </div>
          <div className="nav-links">
            <a href="/"      className="nav-link active">Submit</a>
            <a href="/track" className="nav-link">Track</a>
            <a href="/admin" className="nav-link">Admin</a>
          </div>
        </nav>

        <div className="hero">
          <div className="hero-tag"><div className="hero-dot" />Official Student Portal</div>
          <h1 className="hero-title">Submit Your<br /><em>Complaint</em></h1>
          <p className="hero-desc">AI automatically analyzes your complaint and routes it to the right departments. You'll get a unique tracking ID instantly.</p>
        </div>

        <main className="main" style={{ flex: 1 }}>
          {!success && !loading && (
            <>
              <div className="section-label">Complaint Form</div>
              {error && <div className="error-box">⚠ {error}</div>}
              <div className="form-card">

                {/* Row 1 — Name + Roll No */}
                <div className="field-row">
                  <div className="field">
                    <label className="field-label">Full Name <span>*</span></label>
                    <input className="field-input" placeholder="e.g. Rahul Sharma" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div className="field">
                    <label className="field-label">Student ID <span>*</span></label>
                    <input className="field-input" placeholder="e.g. 22BCE1042" value={rollNo} onChange={e => setRollNo(e.target.value)} />
                  </div>
                </div>

                {/* Row 2 — Title */}
                <div className="field-full">
                  <label className="field-label">
                    Complaint Title <span>*</span>
                    <small>— short summary of the issue</small>
                  </label>
                  <input
                    className="field-input"
                    placeholder="e.g. WiFi not working in Block C, Mess food quality issue, Broken lights in corridor..."
                    value={title}
                    maxLength={120}
                    onChange={e => setTitle(e.target.value)}
                  />
                  <div className={`char-count ${title.length > 100 ? 'warn' : ''}`}>{title.length}/120</div>
                </div>

                {/* Row 3 — Description */}
                <div className="field-full">
                  <label className="field-label">
                    Description <span>*</span>
                    <small>— explain in detail, mention all issues</small>
                  </label>
                  <textarea
                    className="field-textarea"
                    placeholder="Describe your issue in detail. Mention specific location, how long the problem has been occurring, how it is affecting you, and anything else relevant. You can mention multiple problems here."
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && e.ctrlKey && handleSubmit()}
                  />
                </div>

                <div className="card-footer">
                  <div className="card-footer-note">All complaints are confidential · Ctrl+Enter to submit</div>
                  <button className="submit-btn" onClick={handleSubmit}>Submit Complaint →</button>
                </div>
              </div>
            </>
          )}

          {loading && (
            <div className="loading">
              <div className="spinner" />
              <div className="loading-title">Analyzing your complaint...</div>
              <div className="loading-sub">AI is routing to the right departments</div>
            </div>
          )}

          {success && !loading && (
            <div className="success">
              <div className="success-top">
                <div className="success-icon">✓</div>
                <div className="success-title">Complaint Submitted!</div>
                <div className="success-sub">Received and forwarded to the concerned departments.</div>
              </div>
              <div className="success-body">
                <div className="success-id-row">
                  <div>
                    <div className="success-id-label">Your Complaint ID — save this to track status</div>
                    <div className="success-id-value">{success.complaintId}</div>
                  </div>
                  <div className="success-id-status">⏳ PENDING</div>
                </div>
                <div className={`success-priority-row ${isHigh ? 'high' : 'low'}`}>
                  <div className="priority-icon">{isHigh ? '🔴' : '🟢'}</div>
                  {isHigh ? 'High priority — escalated for immediate attention.' : 'Standard priority — queued for review.'}
                </div>
                {success.departments_to_notify.length > 0 && (
                  <div className="success-depts">
                    <div className="success-depts-label">Departments Notified · {success.departments_to_notify.length}</div>
                    <div className="dept-chips">
                      {success.departments_to_notify.map((d, i) => (
                        <div key={d} className="dept-chip" style={{ animationDelay: `${i * 70}ms` }}>
                          <div className="dept-chip-dot" />{d}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button className="new-btn" onClick={reset}>+ Submit Another Complaint</button>
              </div>
            </div>
          )}
        </main>

        <footer className="footer">
          <div className="footer-l">Campus Grievance Portal · All rights reserved</div>
          <div className="footer-r"><div className="footer-dot" />System Online</div>
        </footer>
      </div>
    </>
  );
}