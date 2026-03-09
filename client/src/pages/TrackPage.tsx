import { useState } from 'react';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --b900:#0f0804; --b800:#1e110a; --b700:#2e1a0e; --b600:#4a2c1a;
    --b500:#6b3f28; --b400:#8c5a3c; --b300:#b07850; --b200:#d4aa88;
    --b100:#ead8c0; --b50:#f0e4d0;  --b20:#f7f0e8;
    --white:#ffffff; --cream:#fdfaf6;
    --terra:#b84a20; --terbg:#fdf0eb; --terra2:#e05018;
    --green:#1a5c36; --grbg:#e4f4ec;
    --blue:#1a3a6b;  --blbg:#e4eef8;
    --amber:#b45309; --amberbg:#fef3c7;
    --serif:'Playfair Display',Georgia,serif;
    --sans:'DM Sans',sans-serif;
    --mono:'DM Mono',monospace;
  }

  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--cream);font-family:var(--sans);color:var(--b900);min-height:100vh;}

  /* NAV */
  .tk-nav{
    height:64px; background:var(--b900);
    display:flex; align-items:center; justify-content:space-between;
    padding:0 52px; border-bottom:2px solid var(--terra);
  }
  .tk-nav-logo{display:flex;align-items:center;gap:12px;}
  .tk-nav-mark{
    width:34px;height:34px;border-radius:8px;
    background:linear-gradient(135deg,var(--terra) 0%,var(--b400) 100%);
    display:flex;align-items:center;justify-content:center;font-size:16px;
  }
  .tk-nav-name{font-family:var(--serif);font-size:17px;color:var(--white);}
  .tk-nav-links{display:flex;gap:6px;}
  .tk-nav-link{
    padding:7px 16px; border-radius:7px; font-size:13px; font-weight:500;
    text-decoration:none; color:var(--b300); transition:all 0.2s;
  }
  .tk-nav-link:hover{background:rgba(255,255,255,0.06);color:var(--white);}
  .tk-nav-link.active{background:rgba(184,74,32,0.15);color:var(--terra2);}

  /* HERO */
  .tk-hero{
    background:var(--b800); padding:52px 52px 48px;
    border-bottom:3px solid var(--terra); position:relative; overflow:hidden;
  }
  .tk-hero::before{
    content:''; position:absolute; top:-80px; right:-80px;
    width:400px;height:400px;border-radius:50%;
    background:radial-gradient(circle,rgba(184,74,32,0.1) 0%,transparent 70%);
    pointer-events:none;
  }
  .tk-hero-tag{
    display:inline-flex;align-items:center;gap:7px;
    background:rgba(184,74,32,0.15);border:1px solid rgba(184,74,32,0.3);
    border-radius:4px;padding:5px 12px;
    font-family:var(--mono);font-size:10px;letter-spacing:2px;
    color:var(--terra2);text-transform:uppercase;margin-bottom:18px;
  }
  .tk-hero-dot{width:5px;height:5px;border-radius:50%;background:var(--terra2);animation:pulse 2s infinite;}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
  .tk-hero-title{
    font-family:var(--serif);font-size:48px;font-weight:800;
    color:var(--white);line-height:1.1;letter-spacing:-0.5px;margin-bottom:14px;
  }
  .tk-hero-title em{font-style:italic;color:var(--b200);}
  .tk-hero-desc{font-size:15px;font-weight:300;color:var(--b300);line-height:1.7;max-width:480px;}

  /* MAIN */
  .tk-main{max-width:700px;width:100%;margin:0 auto;padding:52px 24px 60px;}

  /* SEARCH CARD */
  .tk-search-card{
    background:var(--white);border:1.5px solid var(--b100);
    border-radius:16px;overflow:hidden;
    box-shadow:0 4px 32px rgba(15,8,4,0.08);margin-bottom:32px;
  }
  .tk-search-header{
    background:var(--b900);padding:24px 28px;
    display:flex;align-items:center;gap:14px;
  }
  .tk-search-header-icon{
    width:44px;height:44px;border-radius:10px;
    background:rgba(184,74,32,0.2);border:1px solid rgba(184,74,32,0.3);
    display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;
  }
  .tk-search-header-title{font-family:var(--serif);font-size:22px;font-weight:700;color:var(--white);}
  .tk-search-header-sub{font-family:var(--mono);font-size:11px;color:var(--b400);margin-top:3px;}

  .tk-search-body{padding:28px;}
  .tk-input-row{display:flex;gap:12px;align-items:flex-end;}
  .tk-input-wrap{flex:1;}
  .tk-label{
    font-family:var(--mono);font-size:10px;letter-spacing:1.5px;
    text-transform:uppercase;color:var(--b500);margin-bottom:10px;display:block;
  }
  .tk-input{
    width:100%;border:2px solid var(--b100);border-radius:10px;
    padding:14px 18px;font-family:var(--mono);font-size:18px;font-weight:500;
    color:var(--b900);background:var(--b20);outline:none;
    letter-spacing:2px;text-transform:uppercase;transition:all 0.2s;
  }
  .tk-input:focus{border-color:var(--b400);background:var(--white);box-shadow:0 0 0 4px rgba(107,63,40,0.08);}
  .tk-input::placeholder{color:var(--b200);letter-spacing:1px;font-size:15px;text-transform:none;}

  .tk-btn{
    background:var(--b900);color:var(--white);border:none;border-radius:10px;
    padding:14px 28px;font-family:var(--sans);font-size:15px;font-weight:600;
    cursor:pointer;transition:all 0.2s;white-space:nowrap;
  }
  .tk-btn:hover:not(:disabled){background:var(--terra);transform:translateY(-2px);box-shadow:0 6px 20px rgba(184,74,32,0.3);}
  .tk-btn:disabled{background:var(--b200);cursor:not-allowed;}

  .tk-error{
    margin-top:14px;background:var(--terbg);
    border:1.5px solid rgba(184,74,32,0.25);border-left:4px solid var(--terra);
    border-radius:8px;padding:12px 16px;font-size:14px;color:var(--terra);
    display:flex;align-items:center;gap:10px;
  }

  /* LOADING */
  .tk-loading{text-align:center;padding:60px 20px;}
  .tk-spinner{
    width:36px;height:36px;border:3px solid var(--b100);border-top:3px solid var(--terra);
    border-radius:50%;animation:spin 0.75s linear infinite;margin:0 auto 16px;
  }
  @keyframes spin{to{transform:rotate(360deg)}}
  .tk-loading-text{font-family:var(--serif);font-size:20px;font-weight:700;color:var(--b900);}

  /* RESULT CARD */
  .tk-result{animation:fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

  /* STATUS BANNER */
  .tk-banner{
    border-radius:16px;padding:32px 36px;margin-bottom:20px;
    position:relative;overflow:hidden;
  }
  .tk-banner.pending{background:var(--b800);}
  .tk-banner.resolved{background:var(--green);}
  .tk-banner::before{
    content:'';position:absolute;top:-60px;right:-60px;
    width:250px;height:250px;border-radius:50%;
    background:rgba(255,255,255,0.04);pointer-events:none;
  }
  .tk-banner-row{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;}
  .tk-banner-left{}
  .tk-banner-id{
    font-family:var(--mono);font-size:12px;letter-spacing:2px;
    color:rgba(255,255,255,0.5);margin-bottom:8px;
  }
  .tk-banner-name{font-family:var(--serif);font-size:28px;font-weight:800;color:var(--white);margin-bottom:4px;}
  .tk-banner-date{font-family:var(--mono);font-size:11px;color:rgba(255,255,255,0.4);}
  .tk-status-pill{
    padding:10px 20px;border-radius:8px;
    font-family:var(--mono);font-size:13px;font-weight:500;
    letter-spacing:1px;text-transform:uppercase;flex-shrink:0;
    border:1.5px solid rgba(255,255,255,0.2);color:var(--white);
    background:rgba(255,255,255,0.1);
  }

  /* PROGRESS TRACKER */
  .tk-progress-card{
    background:var(--white);border:1.5px solid var(--b100);
    border-radius:14px;padding:28px;margin-bottom:16px;
    box-shadow:0 2px 16px rgba(15,8,4,0.05);
  }
  .tk-progress-title{
    font-family:var(--mono);font-size:10px;letter-spacing:2px;
    text-transform:uppercase;color:var(--b400);margin-bottom:24px;
  }
  .tk-steps{display:flex;align-items:center;gap:0;margin-bottom:28px;}
  .tk-step{flex:1;display:flex;flex-direction:column;align-items:center;position:relative;}
  .tk-step:not(:last-child)::after{
    content:'';position:absolute;top:18px;left:50%;width:100%;height:2px;z-index:0;
  }
  .tk-step.done:not(:last-child)::after{background:var(--green);}
  .tk-step.active:not(:last-child)::after{background:var(--b100);}
  .tk-step.wait:not(:last-child)::after{background:var(--b100);}

  .tk-step-circle{
    width:36px;height:36px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-size:14px;font-weight:600;z-index:1;position:relative;
    font-family:var(--mono);border:2px solid;
  }
  .tk-step.done   .tk-step-circle{background:var(--green);border-color:var(--green);color:var(--white);}
  .tk-step.active .tk-step-circle{background:var(--terra);border-color:var(--terra);color:var(--white);}
  .tk-step.wait   .tk-step-circle{background:var(--white);border-color:var(--b100);color:var(--b300);}

  .tk-step-label{
    font-family:var(--mono);font-size:10px;letter-spacing:0.5px;
    text-transform:uppercase;margin-top:10px;text-align:center;
  }
  .tk-step.done   .tk-step-label{color:var(--green);}
  .tk-step.active .tk-step-label{color:var(--terra);font-weight:500;}
  .tk-step.wait   .tk-step-label{color:var(--b300);}

  /* DETAILS GRID */
  .tk-details-grid{
    display:grid;grid-template-columns:1fr 1fr 1fr;
    gap:12px;margin-top:4px;
  }
  .tk-detail-box{
    background:var(--b20);border:1.5px solid var(--b50);
    border-radius:10px;padding:16px 18px;
  }
  .tk-detail-label{
    font-family:var(--mono);font-size:10px;letter-spacing:1.5px;
    text-transform:uppercase;color:var(--b400);margin-bottom:8px;
  }
  .tk-detail-value{font-size:15px;font-weight:600;color:var(--b900);}

  .ad-badge{
    display:inline-flex;align-items:center;gap:5px;
    padding:4px 10px;border-radius:6px;
    font-family:var(--mono);font-size:11px;letter-spacing:0.5px;
    text-transform:uppercase;white-space:nowrap;
  }
  .ad-bdot{width:6px;height:6px;border-radius:50%;}
  .ad-badge.high{background:var(--terbg);color:var(--terra);border:1px solid rgba(184,74,32,0.2);}
  .ad-badge.high .ad-bdot{background:var(--terra);}
  .ad-badge.low{background:var(--grbg);color:var(--green);border:1px solid rgba(26,92,54,0.2);}
  .ad-badge.low .ad-bdot{background:var(--green);}
  .ad-badge.pending{background:var(--amberbg);color:var(--amber);border:1px solid rgba(180,83,9,0.2);}
  .ad-badge.pending .ad-bdot{background:var(--amber);}
  .ad-badge.resolved{background:var(--grbg);color:var(--green);border:1px solid rgba(26,92,54,0.2);}
  .ad-badge.resolved .ad-bdot{background:var(--green);}
  .ad-dept-chip{
    display:inline-block;background:var(--blbg);color:var(--blue);
    border:1px solid rgba(26,58,107,0.15);border-radius:5px;
    padding:3px 10px;font-family:var(--mono);font-size:11px;font-weight:500;margin:2px 2px 2px 0;
  }

  /* ISSUES */
  .tk-issues-card{
    background:var(--white);border:1.5px solid var(--b100);
    border-radius:14px;overflow:hidden;
    box-shadow:0 2px 16px rgba(15,8,4,0.05);
  }
  .tk-issues-header{
    background:var(--b800);padding:16px 24px;
    display:flex;align-items:center;justify-content:space-between;
  }
  .tk-issues-header-title{font-family:var(--serif);font-size:18px;font-weight:700;color:var(--white);}
  .tk-issues-header-count{
    font-family:var(--mono);font-size:11px;color:var(--b400);
    background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);
    border-radius:6px;padding:4px 10px;
  }
  .tk-issue-row{
    padding:18px 24px;border-bottom:1px solid var(--b50);
    display:flex;align-items:center;gap:14px;flex-wrap:wrap;
  }
  .tk-issue-row:last-child{border-bottom:none;}
  .tk-issue-num{
    font-family:var(--mono);font-size:11px;color:var(--b400);
    background:var(--b20);border:1px solid var(--b100);
    border-radius:5px;padding:3px 8px;flex-shrink:0;
  }
  .tk-issue-text{flex:1;font-size:14px;font-weight:500;color:var(--b900);min-width:160px;}

  /* FOOTER */
  .tk-footer{
    background:var(--b900);padding:20px 52px;
    display:flex;align-items:center;justify-content:space-between;
  }
  .tk-footer-l{font-family:var(--mono);font-size:11px;color:var(--b600);}
  .tk-footer-r{display:flex;align-items:center;gap:6px;font-family:var(--mono);font-size:11px;color:var(--green);}
  .tk-footer-dot{width:6px;height:6px;border-radius:50%;background:var(--green);animation:pulse 2s infinite;}

  @media(max-width:640px){
    .tk-nav{padding:0 20px;} .tk-hero{padding:36px 20px;}
    .tk-hero-title{font-size:34px;} .tk-input-row{flex-direction:column;}
    .tk-details-grid{grid-template-columns:1fr;}
    .tk-footer{padding:16px 20px;flex-direction:column;gap:8px;}
  }
`;

interface Issue { issue:string; category:string; sentiment:string; priority:string; }
interface TrackResult {
  complaintId:string; name:string; status:string;
  overall_priority:string; departments_to_notify:string[];
  total_issues:number; issues:Issue[]; createdAt:string;
}

export default function TrackPage() {
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [result,  setResult]  = useState<TrackResult|null>(null);

  async function handleTrack() {
    if (!input.trim()) { setError('Please enter your complaint ID.'); return; }
    setError(''); setResult(null); setLoading(true);
    try {
      const res  = await fetch(`http://localhost:5000/complaints/track/${input.trim().toUpperCase()}`);
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Complaint not found.'); return; }
      setResult(data);
    } catch {
      setError('Cannot connect to server. Make sure backend is running.');
    } finally { setLoading(false); }
  }

  function fmtDate(d:string) {
    return new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'});
  }

  const isResolved = result?.status === 'Resolved';

  // progress steps
  const steps = [
    { label:'Submitted', state: result ? 'done' : 'wait' },
    { label:'AI Analysis', state: result ? 'done' : 'wait' },
    { label:'Dept Notified', state: result ? 'done' : 'wait' },
    { label:'In Review', state: result ? (isResolved ? 'done' : 'active') : 'wait' },
    { label:'Resolved', state: isResolved ? 'done' : 'wait' },
  ];

  return (
    <><style>{css}</style>
      <div style={{minHeight:'100vh',display:'flex',flexDirection:'column'}}>

        {/* NAV */}
        <nav className="tk-nav">
          <div className="tk-nav-logo">
            <div className="tk-nav-mark">🎓</div>
            <div className="tk-nav-name">Campus Grievance Portal</div>
          </div>
          <div className="tk-nav-links">
            <a href="/" className="tk-nav-link">Submit</a>
            <a href="/track" className="tk-nav-link active">Track</a>
            <a href="/admin" className="tk-nav-link">Admin</a>
          </div>
        </nav>

        {/* HERO */}
        <div className="tk-hero">
          <div className="tk-hero-tag"><div className="tk-hero-dot"/>Complaint Tracking</div>
          <h1 className="tk-hero-title">Track Your<br/><em>Complaint</em></h1>
          <p className="tk-hero-desc">Enter the complaint ID you received after submission to check its current status and progress.</p>
        </div>

        {/* MAIN */}
        <main className="tk-main" style={{flex:1}}>

          {/* SEARCH */}
          <div className="tk-search-card">
            <div className="tk-search-header">
              <div className="tk-search-header-icon">🔍</div>
              <div>
                <div className="tk-search-header-title">Enter Complaint ID</div>
                <div className="tk-search-header-sub">Format: GRV-XXXX</div>
              </div>
            </div>
            <div className="tk-search-body">
              <div className="tk-input-row">
                <div className="tk-input-wrap">
                  <label className="tk-label">Complaint ID</label>
                  <input
                    className="tk-input"
                    placeholder="GRV-1234"
                    value={input}
                    onChange={e=>setInput(e.target.value.toUpperCase())}
                    onKeyDown={e=>e.key==='Enter'&&handleTrack()}
                    maxLength={8}
                  />
                </div>
                <button className="tk-btn" onClick={handleTrack} disabled={loading}>
                  {loading ? '...' : 'Track →'}
                </button>
              </div>
              {error && <div className="tk-error">⚠ {error}</div>}
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="tk-loading">
              <div className="tk-spinner"/>
              <div className="tk-loading-text">Fetching complaint...</div>
            </div>
          )}

          {/* RESULT */}
          {result && !loading && (
            <div className="tk-result">

              {/* STATUS BANNER */}
              <div className={`tk-banner ${isResolved?'resolved':'pending'}`}>
                <div className="tk-banner-row">
                  <div className="tk-banner-left">
                    <div className="tk-banner-id">COMPLAINT ID · {result.complaintId}</div>
                    <div className="tk-banner-name">{result.name}</div>
                    <div className="tk-banner-date">Submitted on {fmtDate(result.createdAt)}</div>
                  </div>
                  <div className="tk-status-pill">
                    {isResolved ? '✓ Resolved' : '⏳ Pending'}
                  </div>
                </div>
              </div>

              {/* PROGRESS TRACKER */}
              <div className="tk-progress-card">
                <div className="tk-progress-title">Complaint Progress</div>
                <div className="tk-steps">
                  {steps.map((s,i)=>(
                    <div key={i} className={`tk-step ${s.state}`}>
                      <div className="tk-step-circle">
                        {s.state==='done' ? '✓' : s.state==='active' ? '●' : String(i+1)}
                      </div>
                      <div className="tk-step-label">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* DETAILS */}
                <div className="tk-details-grid">
                  <div className="tk-detail-box">
                    <div className="tk-detail-label">Priority</div>
                    <span className={`ad-badge ${result.overall_priority.toLowerCase()}`}>
                      <span className="ad-bdot"/>{result.overall_priority}
                    </span>
                  </div>
                  <div className="tk-detail-box">
                    <div className="tk-detail-label">Issues Detected</div>
                    <div className="tk-detail-value">{result.total_issues}</div>
                  </div>
                  <div className="tk-detail-box">
                    <div className="tk-detail-label">Departments</div>
                    <div style={{marginTop:2}}>
                      {result.departments_to_notify.map(d=>(
                        <span key={d} className="ad-dept-chip">{d}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ISSUES LIST */}
              {result.issues.length > 0 && (
                <div className="tk-issues-card">
                  <div className="tk-issues-header">
                    <div className="tk-issues-header-title">Detected Issues</div>
                    <div className="tk-issues-header-count">{result.total_issues} issue{result.total_issues!==1?'s':''}</div>
                  </div>
                  {result.issues.map((iss,i)=>(
                    <div key={i} className="tk-issue-row" style={{animationDelay:`${i*60}ms`}}>
                      <span className="tk-issue-num">#{i+1}</span>
                      <div className="tk-issue-text">{iss.issue}</div>
                      <span className="ad-dept-chip">{iss.category}</span>
                      <span className={`ad-badge ${iss.priority.toLowerCase()}`}>
                        <span className="ad-bdot"/>{iss.priority}
                      </span>
                      <span className={`ad-badge ${result.status.toLowerCase()}`}>
                        <span className="ad-bdot"/>{result.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </main>

        {/* FOOTER */}
        <footer className="tk-footer">
          <div className="tk-footer-l">Campus Grievance Portal · All complaints are confidential</div>
          <div className="tk-footer-r"><div className="tk-footer-dot"/>System Online</div>
        </footer>

      </div>
    </>
  );
}
