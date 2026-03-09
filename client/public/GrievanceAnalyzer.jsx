import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────
   DESIGN: Editorial Newspaper × Modern SaaS
   Cream background · Ink black type
   Bold serif headlines · DM Mono labels
   Brutalist card borders · Red accent
   Asymmetric layout · Staggered animations
───────────────────────────────────────── */

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Mono:wght@400;500&family=Lato:wght@300;400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream:    #f5f0e8;
    --white:    #fdfcf9;
    --ink:      #1a1208;
    --ink2:     #3d3525;
    --muted:    #9c9080;
    --red:      #d63c2f;
    --red-bg:   #fdf0ee;
    --green:    #1a7a4a;
    --green-bg: #edf7f1;
    --blue:     #1a4d8f;
    --blue-bg:  #edf2fc;
    --border:   #d4cdbf;
    --border2:  #e8e2d8;
    --serif:    'Playfair Display', Georgia, serif;
    --mono:     'DM Mono', monospace;
    --sans:     'Lato', sans-serif;
  }

  body { background: var(--cream); color: var(--ink); font-family: var(--sans); min-height: 100vh; }

  /* HEADER */
  .ga-header {
    background: var(--ink);
    color: var(--cream);
    padding: 0 48px;
    display: flex;
    align-items: stretch;
    border-bottom: 3px solid var(--red);
    position: relative;
    overflow: hidden;
  }
  .ga-header::after {
    content: '';
    position: absolute; top: 0; right: 0;
    width: 300px; height: 100%;
    background: repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(255,255,255,0.03) 12px, rgba(255,255,255,0.03) 13px);
    pointer-events: none;
  }
  .ga-header-left {
    padding: 28px 0;
    flex: 1;
    border-right: 1px solid rgba(255,255,255,0.1);
    padding-right: 40px;
  }
  .ga-header-eyebrow {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--red);
    margin-bottom: 8px;
  }
  .ga-header-title {
    font-family: var(--serif);
    font-size: 32px;
    font-weight: 900;
    line-height: 1.1;
    letter-spacing: -0.5px;
  }
  .ga-header-right {
    padding: 28px 0 28px 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    min-width: 240px;
  }
  .ga-header-stat {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--mono);
    font-size: 10px;
    color: rgba(245,240,232,0.45);
    letter-spacing: 1px;
  }
  .ga-header-stat span { color: var(--cream); font-weight: 500; }

  /* MAIN */
  .ga-main { max-width: 1000px; margin: 0 auto; padding: 48px 24px; }

  /* INPUT SECTION */
  .ga-input-section {
    display: grid;
    grid-template-columns: 1fr 260px;
    border: 2px solid var(--ink);
    border-radius: 2px;
    margin-bottom: 48px;
    background: var(--white);
    box-shadow: 6px 6px 0 var(--ink);
  }
  .ga-input-left {
    padding: 28px;
    border-right: 2px solid var(--ink);
  }
  .ga-input-label {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 10px;
  }
  .ga-textarea {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-family: var(--sans);
    font-size: 15px;
    color: var(--ink);
    resize: none;
    min-height: 110px;
    line-height: 1.7;
  }
  .ga-textarea::placeholder { color: var(--muted); }
  .ga-input-right {
    padding: 28px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
  }
  .ga-input-hint {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--muted);
    line-height: 1.7;
  }
  .ga-input-hint strong {
    color: var(--ink2);
    display: block;
    margin-bottom: 6px;
    font-size: 11px;
    font-family: var(--mono);
  }
  .ga-btn {
    background: var(--ink);
    color: var(--cream);
    border: 2px solid var(--ink);
    border-radius: 2px;
    padding: 13px 18px;
    font-family: var(--mono);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.15s, color 0.15s, transform 0.1s, box-shadow 0.1s;
    width: 100%;
  }
  .ga-btn:hover:not(:disabled) {
    background: var(--red);
    border-color: var(--red);
    transform: translate(-2px, -2px);
    box-shadow: 4px 4px 0 var(--ink);
  }
  .ga-btn:disabled { background: var(--muted); border-color: var(--muted); cursor: not-allowed; }

  /* SUMMARY */
  .ga-summary {
    display: grid;
    grid-template-columns: 120px 180px 1fr;
    border: 2px solid var(--ink);
    border-radius: 2px;
    margin-bottom: 32px;
    background: var(--white);
    overflow: hidden;
    animation: fadeUp 0.3s ease both;
  }
  .ga-summary-cell {
    padding: 20px 24px;
    border-right: 2px solid var(--ink);
  }
  .ga-summary-cell:last-child { border-right: none; }
  .ga-summary-label {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }
  .ga-summary-value {
    font-family: var(--serif);
    font-size: 28px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1;
  }

  /* DEPT TAGS */
  .ga-dept-wrap { display: flex; flex-wrap: wrap; gap: 6px; padding-top: 2px; }
  .ga-dept {
    font-family: var(--mono);
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 2px;
    background: var(--blue-bg);
    color: var(--blue);
    border: 1px solid rgba(26,77,143,0.2);
    letter-spacing: 0.3px;
  }

  /* BADGE */
  .ga-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: var(--mono);
    font-size: 10px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 2px;
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }
  .ga-badge-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .ga-badge.high,
  .ga-badge.negative { background: var(--red-bg);   color: var(--red);   }
  .ga-badge.high .ga-badge-dot,
  .ga-badge.negative .ga-badge-dot { background: var(--red); }
  .ga-badge.low,
  .ga-badge.positive { background: var(--green-bg); color: var(--green); }
  .ga-badge.low .ga-badge-dot,
  .ga-badge.positive .ga-badge-dot { background: var(--green); }

  /* DIVIDER */
  .ga-divider {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
  }
  .ga-divider-line { flex: 1; height: 2px; background: var(--ink); }
  .ga-divider-text { font-family: var(--serif); font-size: 22px; font-weight: 700; white-space: nowrap; }
  .ga-divider-count {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--muted);
    background: var(--cream);
    border: 1px solid var(--border);
    padding: 2px 10px;
    border-radius: 2px;
    white-space: nowrap;
  }

  /* ISSUE CARD */
  .ga-issue-card {
    background: var(--white);
    border: 2px solid var(--ink);
    border-radius: 2px;
    margin-bottom: 12px;
    display: grid;
    grid-template-columns: 48px 1fr 150px 130px 120px;
    overflow: hidden;
    transition: transform 0.15s, box-shadow 0.15s;
    animation: fadeUp 0.3s ease both;
  }
  .ga-issue-card:hover {
    transform: translate(-3px, -3px);
    box-shadow: 5px 5px 0 var(--ink);
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ga-issue-num {
    background: var(--ink);
    color: var(--cream);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--serif);
    font-size: 18px;
    font-weight: 700;
    border-right: 2px solid var(--ink);
    min-height: 80px;
  }
  .ga-issue-num.high { background: var(--red); }
  .ga-issue-num.low  { background: var(--green); }

  .ga-issue-body {
    padding: 16px 20px;
    border-right: 1px solid var(--border2);
  }
  .ga-issue-body-label {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 5px;
  }
  .ga-issue-body-text {
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.4;
  }
  .ga-issue-cell {
    padding: 16px 16px;
    border-right: 1px solid var(--border2);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .ga-issue-cell:last-child { border-right: none; }
  .ga-issue-cell-label {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 6px;
  }
  .ga-issue-cell-value {
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 700;
    color: var(--ink2);
  }

  /* ANALYZING */
  .ga-analyzing { text-align: center; padding: 60px 20px; }
  .ga-analyzing-title { font-family: var(--serif); font-size: 26px; font-weight: 700; margin-bottom: 10px; }
  .ga-analyzing-sub { font-family: var(--mono); font-size: 11px; color: var(--muted); letter-spacing: 2px; }
  .ga-dots { display: flex; justify-content: center; gap: 8px; margin: 18px 0; }
  .ga-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    background: var(--ink);
    animation: bounce 1.2s infinite ease-in-out;
  }
  .ga-dot:nth-child(2) { animation-delay: 0.2s; background: var(--red); }
  .ga-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40%           { transform: scale(1.0); opacity: 1.0; }
  }

  /* NO ISSUES */
  .ga-no-issues {
    border: 2px solid var(--green);
    background: var(--green-bg);
    border-radius: 2px;
    padding: 32px;
    text-align: center;
  }
  .ga-no-issues-title { font-family: var(--serif); font-size: 22px; font-weight: 700; color: var(--green); margin-bottom: 6px; }
  .ga-no-issues-sub { font-family: var(--mono); font-size: 11px; color: var(--green); opacity: 0.7; letter-spacing: 1px; }

  /* ERROR */
  .ga-error {
    border: 2px solid var(--red);
    background: var(--red-bg);
    border-radius: 2px;
    padding: 14px 20px;
    font-family: var(--mono);
    font-size: 12px;
    color: var(--red);
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* FOOTER */
  .ga-footer {
    border-top: 2px solid var(--ink);
    padding: 18px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--white);
    margin-top: 60px;
  }
  .ga-footer-left { font-family: var(--mono); font-size: 10px; color: var(--muted); letter-spacing: 0.5px; }
  .ga-footer-right { display: flex; gap: 8px; flex-wrap: wrap; }
  .ga-footer-tag {
    font-family: var(--mono);
    font-size: 9px;
    color: var(--muted);
    background: var(--cream);
    border: 1px solid var(--border);
    padding: 3px 8px;
    border-radius: 2px;
    letter-spacing: 0.5px;
  }

  @media (max-width: 720px) {
    .ga-header { padding: 0 20px; flex-direction: column; }
    .ga-header-left { border-right: none; padding-right: 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .ga-header-right { padding: 16px 0; min-width: unset; }
    .ga-input-section { grid-template-columns: 1fr; }
    .ga-input-left { border-right: none; border-bottom: 2px solid var(--ink); }
    .ga-summary { grid-template-columns: 1fr; }
    .ga-summary-cell { border-right: none; border-bottom: 2px solid var(--ink); }
    .ga-issue-card { grid-template-columns: 40px 1fr; }
    .ga-issue-cell { display: none; }
    .ga-main { padding: 24px 16px; }
    .ga-footer { flex-direction: column; gap: 12px; padding: 16px 20px; }
  }
`;

function Badge({ label }) {
  const cls = label?.toLowerCase() || "";
  return (
    <span className={`ga-badge ${cls}`}>
      <span className="ga-badge-dot" />
      {label}
    </span>
  );
}

function IssueCard({ item, index, delay }) {
  const isHigh = item.priority === "High";
  return (
    <div className="ga-issue-card" style={{ animationDelay: `${delay}ms` }}>
      <div className={`ga-issue-num ${isHigh ? "high" : "low"}`}>
        {index + 1}
      </div>
      <div className="ga-issue-body">
        <div className="ga-issue-body-label">Complaint</div>
        <div className="ga-issue-body-text">{item.issue}</div>
      </div>
      <div className="ga-issue-cell">
        <div className="ga-issue-cell-label">Department</div>
        <div className="ga-issue-cell-value">{item.category}</div>
      </div>
      <div className="ga-issue-cell">
        <div className="ga-issue-cell-label">Sentiment</div>
        <Badge label={item.sentiment} />
      </div>
      <div className="ga-issue-cell">
        <div className="ga-issue-cell-label">Priority</div>
        <Badge label={item.priority} />
      </div>
    </div>
  );
}

export default function GrievanceAnalyzer() {
  const [text,    setText]    = useState("");
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [time,    setTime]    = useState("");

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  async function analyze() {
    if (!text.trim()) { setError("Please enter a complaint to analyze."); return; }
    setError(""); setResult(null); setLoading(true);
    try {
      const res  = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      setResult(await res.json());
    } catch {
      setError("Cannot connect to backend. Make sure your Node server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{CSS}</style>

      <header className="ga-header">
        <div className="ga-header-left">
          <div className="ga-header-eyebrow">AI · NLP · Machine Learning</div>
          <div className="ga-header-title">Smart Grievance<br />Analyzer</div>
        </div>
        <div className="ga-header-right">
          <div className="ga-header-stat">MODEL <span>Naive Bayes + DistilBERT</span></div>
          <div className="ga-header-stat">PIPELINE <span>TF-IDF · NLTK · Transformers</span></div>
          <div className="ga-header-stat">TIME <span>{time}</span></div>
        </div>
      </header>

      <main className="ga-main">

        <div className="ga-input-section">
          <div className="ga-input-left">
            <div className="ga-input-label">Complaint Input</div>
            <textarea
              className="ga-textarea"
              placeholder="Type your complaint here. You can include multiple issues — e.g. Wifi is not working since 2 days and food in mess is very bad. Teacher is absent frequently."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && e.ctrlKey && analyze()}
            />
          </div>
          <div className="ga-input-right">
            <div className="ga-input-hint">
              <strong>How it works</strong>
              The AI splits your paragraph into individual issues, classifies each by department, detects sentiment and assigns priority automatically.
              <br /><br />
              Ctrl + Enter to submit
            </div>
            <button className="ga-btn" onClick={analyze} disabled={loading}>
              {loading ? "Analyzing..." : "→ Run Analysis"}
            </button>
          </div>
        </div>

        {error && <div className="ga-error"><span>⚠</span>{error}</div>}

        {loading && (
          <div className="ga-analyzing">
            <div className="ga-dots">
              <div className="ga-dot" /><div className="ga-dot" /><div className="ga-dot" />
            </div>
            <div className="ga-analyzing-title">Analyzing Complaint</div>
            <div className="ga-analyzing-sub">RUNNING · NLP PIPELINE · DETECTING ISSUES</div>
          </div>
        )}

        {result && !loading && (
          <>
            <div className="ga-summary">
              <div className="ga-summary-cell">
                <div className="ga-summary-label">Issues Found</div>
                <div className="ga-summary-value">{result.total_issues}</div>
              </div>
              <div className="ga-summary-cell">
                <div className="ga-summary-label">Overall Priority</div>
                <div style={{ paddingTop: "4px" }}>
                  <Badge label={result.overall_priority} />
                </div>
              </div>
              <div className="ga-summary-cell">
                <div className="ga-summary-label">Departments to Notify</div>
                <div className="ga-dept-wrap">
                  {result.departments_to_notify.length > 0
                    ? result.departments_to_notify.map(d => <span key={d} className="ga-dept">{d}</span>)
                    : <span style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--muted)" }}>None</span>
                  }
                </div>
              </div>
            </div>

            <div className="ga-divider">
              <div className="ga-divider-line" />
              <div className="ga-divider-text">Detected Issues</div>
              <div className="ga-divider-count">{result.total_issues} found</div>
              <div className="ga-divider-line" />
            </div>

            {result.issues.length === 0
              ? <div className="ga-no-issues">
                  <div className="ga-no-issues-title">✓ No Issues Detected</div>
                  <div className="ga-no-issues-sub">NO NEGATIVE COMPLAINTS FOUND IN SUBMITTED TEXT</div>
                </div>
              : result.issues.map((item, i) => (
                  <IssueCard key={i} item={item} index={i} delay={i * 80} />
                ))
            }
          </>
        )}
      </main>

      <footer className="ga-footer">
        <div className="ga-footer-left">Smart Grievance Analyzer · MERN + Python ML Pipeline</div>
        <div className="ga-footer-right">
          {["React", "Node.js", "Python", "Naive Bayes", "DistilBERT", "NLTK", "TF-IDF"].map(t => (
            <span key={t} className="ga-footer-tag">{t}</span>
          ))}
        </div>
      </footer>
    </>
  );
}
