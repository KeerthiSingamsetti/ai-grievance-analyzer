import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area, CartesianGrid,
} from 'recharts';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:#f8f3ee;color:#2a1508;}

@keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes expandIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
@keyframes modalIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}

/* ══════════════════ ROOT ══════════════════ */
.root{display:flex;min-height:100vh;}

/* ══════════════════ SIDEBAR ══════════════════ */
.sb{
  width:220px;flex-shrink:0;background:#1e0e06;
  display:flex;flex-direction:column;
  position:fixed;top:0;left:0;bottom:0;
  border-right:1px solid rgba(255,255,255,0.04);z-index:200;
}
.sb-logo{padding:20px 16px 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid rgba(255,255,255,0.05);}
.sb-mark{width:36px;height:36px;border-radius:9px;flex-shrink:0;background:linear-gradient(135deg,#b84a20 0%,#7a3010 100%);display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 4px 12px rgba(184,74,32,0.4);}
.sb-name{font-family:'Playfair Display',serif;font-size:13px;color:#f0e0d0;line-height:1.25;}
.sb-tag{font-family:'DM Mono',monospace;font-size:9px;color:#4a2a18;letter-spacing:2px;margin-top:2px;}
.sb-sec{padding:16px 10px 4px;}
.sb-sec-lbl{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:#3a2018;padding:0 10px;margin-bottom:5px;}
.sbi{display:flex;align-items:center;gap:9px;padding:10px 12px;border-radius:8px;cursor:pointer;transition:all 0.15s;margin-bottom:2px;position:relative;text-decoration:none;}
.sbi:hover{background:rgba(255,255,255,0.04);}
.sbi.on{background:rgba(184,74,32,0.15);}
.sbi.on::before{content:'';position:absolute;left:0;top:22%;bottom:22%;width:3px;border-radius:0 3px 3px 0;background:#b84a20;}
.sbi-ico{font-size:15px;width:22px;text-align:center;flex-shrink:0;}
.sbi-lbl{font-size:14px;font-weight:500;color:#6a4030;}
.sbi.on .sbi-lbl{color:#e8c8a8;}
.sbi:hover .sbi-lbl{color:#9a6050;}
.sb-badge{margin-left:auto;font-family:'DM Mono',monospace;font-size:11px;background:rgba(184,74,32,0.2);color:#e8622e;padding:2px 8px;border-radius:10px;}
.sb-div{height:1px;background:rgba(255,255,255,0.04);margin:6px 12px;}
.sb-foot{margin-top:auto;padding:14px 10px;border-top:1px solid rgba(255,255,255,0.04);}
.sb-online{display:flex;align-items:center;gap:8px;background:rgba(26,92,54,0.12);border-radius:8px;padding:9px 12px;margin-bottom:8px;}
.sb-dot{width:7px;height:7px;border-radius:50%;background:#2aaa60;animation:blink 2s infinite;}
.sb-online-txt{font-family:'DM Mono',monospace;font-size:12px;color:#2aaa60;}
.sb-logout{width:100%;border:1px solid rgba(184,74,32,0.2);background:rgba(184,74,32,0.08);border-radius:8px;padding:9px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:#c86030;cursor:pointer;transition:all 0.18s;}
.sb-logout:hover{background:rgba(184,74,32,0.18);color:#e8622e;}

/* ══════════════════ SHELL ══════════════════ */
.shell{margin-left:220px;flex:1;display:flex;flex-direction:column;min-height:100vh;}

.topbar{height:56px;background:#fff;border-bottom:1.5px solid #e8d8c8;display:flex;align-items:center;justify-content:space-between;padding:0 28px;position:sticky;top:0;z-index:100;flex-shrink:0;}
.topbar-t{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:#2a1508;}
.topbar-r{display:flex;align-items:center;gap:10px;}
.topbar-date{font-family:'DM Mono',monospace;font-size:12px;color:#b89080;}
.top-btn{background:#f8f3ee;border:1.5px solid #e0cfc0;border-radius:7px;padding:7px 14px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:#5c3d2a;cursor:pointer;transition:all 0.18s;}
.top-btn:hover{background:#fdf6ee;border-color:#b89080;}

/* ══════════════════ STAT STRIP ══════════════════ */
.stat-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;padding:20px 26px;background:#f8f3ee;border-bottom:1.5px solid #e8d8c8;flex-shrink:0;}
.sc{background:#fdf6ee;border:1.5px solid #e0cfc0;border-radius:13px;padding:18px 20px;position:relative;overflow:hidden;box-shadow:0 2px 12px rgba(42,21,8,0.05);animation:fadeUp 0.4s ease both;}
.sc:nth-child(2){animation-delay:.07s} .sc:nth-child(3){animation-delay:.13s} .sc:nth-child(4){animation-delay:.19s}
.sc::after{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:13px 13px 0 0;}
.sc.t::after{background:linear-gradient(90deg,#8c5a3c,#c09060);}
.sc.h::after{background:linear-gradient(90deg,#b84a20,#e06030);}
.sc.p::after{background:linear-gradient(90deg,#b45309,#d97706);}
.sc.r::after{background:linear-gradient(90deg,#1a5c36,#2aaa60);}
.sc-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.sc-ico{width:38px;height:38px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:17px;}
.sc.t .sc-ico{background:#f0e4d4;} .sc.h .sc-ico{background:#fdf0eb;} .sc.p .sc-ico{background:#fef3c7;} .sc.r .sc-ico{background:#e4f4ec;}
.sc-pct{font-family:'DM Mono',monospace;font-size:11px;padding:3px 9px;border-radius:5px;}
.sc.t .sc-pct{background:#f0e4d4;color:#7a4a28;} .sc.h .sc-pct{background:#fdf0eb;color:#b84a20;} .sc.p .sc-pct{background:#fef3c7;color:#b45309;} .sc.r .sc-pct{background:#e4f4ec;color:#1a5c36;}
.sc-lbl{font-family:'DM Mono',monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#8a6550;margin-bottom:5px;}
.sc-val{font-family:'Playfair Display',serif;font-size:44px;font-weight:800;line-height:1;color:#2a1508;margin-bottom:12px;}
.sc.h .sc-val{color:#b84a20;} .sc.p .sc-val{color:#b45309;} .sc.r .sc-val{color:#1a5c36;}
.sc-bar{height:4px;background:#e8d8c8;border-radius:4px;overflow:hidden;}
.sc-bar-fill{height:100%;border-radius:4px;transition:width 0.8s ease;}
.sc.t .sc-bar-fill{background:#8c5a3c;} .sc.h .sc-bar-fill{background:#b84a20;} .sc.p .sc-bar-fill{background:#b45309;} .sc.r .sc-bar-fill{background:#1a5c36;}

/* ══════════════════ BODY ══════════════════ */
.body{display:flex;flex:1;overflow:hidden;}
.content{flex:1;overflow-y:auto;padding:22px 26px 40px;}
.content::-webkit-scrollbar{width:4px;}
.content::-webkit-scrollbar-thumb{background:#e0cfc0;border-radius:4px;}

/* ══════════════════ RIGHT PANEL ══════════════════ */
.r-panel{width:220px;flex-shrink:0;background:#fff;border-left:1.5px solid #e8d8c8;overflow-y:auto;padding:20px 18px;}
.rp-title{font-family:'Playfair Display',serif;font-size:17px;font-weight:700;color:#2a1508;margin-bottom:3px;}
.rp-sub{font-family:'DM Mono',monospace;font-size:10px;color:#8a6550;margin-bottom:16px;letter-spacing:0.5px;}
.rp-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #ede0d0;}
.rp-row:last-of-type{border-bottom:none;}
.rp-lbl{font-size:14px;font-weight:500;color:#5c3d2a;}
.rp-val{font-family:'DM Mono',monospace;font-size:14px;font-weight:600;}
.rp-val.tv{color:#2a1508;} .rp-val.hv{color:#b84a20;} .rp-val.pv{color:#b45309;} .rp-val.rv{color:#1a5c36;}
.rp-div{height:1px;background:#ede0d0;margin:16px 0;}
.rp-sec-lbl{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8a6550;margin-bottom:12px;}
.dept-item{margin-bottom:14px;}
.dept-row-wrap{display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;}
.dept-name{font-size:14px;font-weight:600;color:#2a1508;}
.dept-num{font-family:'DM Mono',monospace;font-size:13px;font-weight:600;color:#5c3d2a;}
.dept-track{height:7px;background:#f0e4d4;border-radius:6px;overflow:hidden;}
.dept-fill{height:100%;border-radius:6px;transition:width 0.6s ease;}

/* ══════════════════ FILTERS ══════════════════ */
.filters{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;align-items:center;}
.srch{flex:1;min-width:180px;position:relative;display:flex;align-items:center;}
.srch-ico{position:absolute;left:12px;font-size:14px;color:#b89080;pointer-events:none;}
.srch-inp{width:100%;background:#fff;border:1.5px solid #e0cfc0;border-radius:9px;padding:10px 14px 10px 34px;font-family:'DM Sans',sans-serif;font-size:14px;color:#2a1508;outline:none;transition:all 0.18s;}
.srch-inp:focus{border-color:#8c5a3c;box-shadow:0 0 0 3px rgba(140,90,60,0.08);}
.srch-inp::placeholder{color:#b89080;}
.fsel{background:#fff;border:1.5px solid #e0cfc0;border-radius:9px;padding:10px 13px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;color:#3a2010;outline:none;cursor:pointer;transition:border 0.18s;}
.fsel:focus{border-color:#8c5a3c;}
.fcount{font-family:'DM Mono',monospace;font-size:12px;color:#5c3d2a;background:#fff;border:1.5px solid #e0cfc0;border-radius:7px;padding:6px 12px;margin-left:auto;white-space:nowrap;font-weight:600;}

/* ══════════════════ TABLE ══════════════════ */
.tcard{background:#fff;border:1.5px solid #e0cfc0;border-radius:14px;overflow:hidden;box-shadow:0 2px 12px rgba(42,21,8,0.05);margin-bottom:8px;}
table{width:100%;border-collapse:collapse;}
thead tr{background:#1e0e06;}
th{
  padding:14px 18px;text-align:left;
  font-family:'DM Mono',monospace;font-size:11px;letter-spacing:1.5px;
  text-transform:uppercase;color:#c09070;white-space:nowrap;font-weight:500;
  border-right:1px solid rgba(255,255,255,0.04);
}
th:last-child{border-right:none;}
td{
  padding:16px 18px;font-size:15px;color:#2a1508;
  border-bottom:1px solid #ede0d0;vertical-align:middle;
  border-right:1px solid #f5ede4;
}
td:last-child{border-right:none;}
tbody tr:last-child td{border-bottom:none;}
tbody tr{transition:background 0.15s;cursor:pointer;}
tbody tr:hover td{background:#fdf6ee;}
tbody tr.open td{background:#fdf6ee;}

/* cell styles — all bigger and high contrast */
.cid{font-family:'DM Mono',monospace;font-size:14px;font-weight:600;color:#b84a20;letter-spacing:1px;}
.cname{font-size:16px;font-weight:700;color:#2a1508;}
.croll{font-family:'DM Mono',monospace;font-size:12px;color:#7a5040;margin-top:3px;font-weight:500;}
.ctitle{font-size:15px;font-weight:600;color:#2a1508;}
.cdate{font-family:'DM Mono',monospace;font-size:13px;color:#5c3d2a;white-space:nowrap;font-weight:500;}
.chevron{font-size:12px;color:#8a6550;transition:transform 0.2s;display:inline-block;margin-left:6px;}
.open .chevron{transform:rotate(180deg);}

/* ══════════════════ BADGES ══════════════════ */
.bdg{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:6px;font-family:'DM Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0.5px;text-transform:uppercase;white-space:nowrap;border:1px solid;}
.bd{width:6px;height:6px;border-radius:50%;}
.bdg.high    {background:#fdf0eb;color:#b84a20;border-color:rgba(184,74,32,0.25);}
.bdg.high    .bd{background:#b84a20;}
.bdg.low     {background:#e4f4ec;color:#1a5c36;border-color:rgba(26,92,54,0.25);}
.bdg.low     .bd{background:#1a5c36;}
.bdg.pending {background:#fef3c7;color:#92400e;border-color:rgba(180,83,9,0.25);}
.bdg.pending .bd{background:#b45309;}
.bdg.resolved{background:#e4f4ec;color:#1a5c36;border-color:rgba(26,92,54,0.25);}
.bdg.resolved .bd{background:#1a5c36;}
.bdg.negative{background:#fdf0eb;color:#b84a20;border-color:rgba(184,74,32,0.25);}
.bdg.negative .bd{background:#b84a20;}
.bdg.positive{background:#e4f4ec;color:#1a5c36;border-color:rgba(26,92,54,0.25);}
.bdg.positive .bd{background:#1a5c36;}
.dchip{display:inline-block;background:#ddeaf8;color:#1a3a6b;border:1px solid rgba(26,58,107,0.2);border-radius:5px;padding:3px 9px;font-family:'DM Mono',monospace;font-size:12px;font-weight:600;margin:2px 2px 0 0;}

/* ══════════════════ EXPANDED ROW ══════════════════ */
.xrow td{background:#f4ede4 !important;padding:0 !important;border-bottom:1.5px solid #e0cfc0 !important;}
.xinn{padding:20px 24px;}
.exp-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:16px;}
.exp-sec-lbl{font-family:'DM Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7a5040;margin-bottom:10px;font-weight:500;}
.exp-text{font-size:15px;color:#2a1508;line-height:1.75;background:#fff;border:1px solid #e0cfc0;border-radius:9px;padding:14px 16px;font-weight:400;}
.exp-issues{display:flex;flex-direction:column;gap:8px;}
.exp-issue{background:#fff;border:1px solid #e0cfc0;border-radius:8px;padding:12px 14px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.exp-inum{font-family:'DM Mono',monospace;font-size:12px;color:#8a6550;background:#f8f3ee;border:1px solid #e0cfc0;border-radius:5px;padding:3px 8px;flex-shrink:0;font-weight:500;}
.exp-itxt{flex:1;font-size:15px;font-weight:600;color:#2a1508;min-width:120px;}
.exp-depts{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;}
.exp-dept{display:flex;align-items:center;gap:7px;background:#ddeaf8;color:#1a3a6b;border:1.5px solid rgba(26,58,107,0.2);border-radius:8px;padding:9px 14px;font-size:14px;font-weight:700;}
.exp-ddot{width:7px;height:7px;border-radius:50%;background:#1a3a6b;}
.exp-actions{display:flex;gap:10px;align-items:center;}
.res-btn{flex:1;background:#1e0e06;color:#f8f3ee;border:none;border-radius:9px;padding:13px 20px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all 0.2s;}
.res-btn:hover:not(:disabled){background:#1a5c36;box-shadow:0 5px 18px rgba(26,92,54,0.3);transform:translateY(-1px);}
.res-btn:disabled{background:#e4f4ec;color:#1a5c36;cursor:default;transform:none;}
.view-btn{background:#fff;color:#2a1508;border:1.5px solid #e0cfc0;border-radius:9px;padding:13px 18px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.18s;white-space:nowrap;}
.view-btn:hover{background:#f8f3ee;border-color:#8c5a3c;}
.exp-ts{font-family:'DM Mono',monospace;font-size:12px;color:#8a6550;margin-left:auto;}

/* ══════════════════ MODAL ══════════════════ */
.modal-overlay{position:fixed;inset:0;background:rgba(30,14,6,0.6);z-index:500;display:flex;align-items:center;justify-content:center;padding:24px;}
.modal{background:#fff;border-radius:16px;max-width:640px;width:100%;max-height:85vh;overflow-y:auto;box-shadow:0 24px 64px rgba(30,14,6,0.25);animation:modalIn 0.25s cubic-bezier(0.16,1,0.3,1) both;}
.modal-head{padding:24px 28px 20px;border-bottom:1.5px solid #ede0d0;display:flex;align-items:flex-start;justify-content:space-between;gap:16px;}
.modal-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:800;color:#2a1508;line-height:1.3;flex:1;}
.modal-close{width:34px;height:34px;border-radius:8px;background:#f8f3ee;border:1.5px solid #e0cfc0;display:flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer;flex-shrink:0;transition:all 0.15s;color:#5c3d2a;}
.modal-close:hover{background:#fdf0eb;border-color:#b84a20;color:#b84a20;}
.modal-meta{padding:16px 28px;background:#f8f3ee;border-bottom:1.5px solid #ede0d0;display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.modal-id{font-family:'DM Mono',monospace;font-size:13px;font-weight:600;color:#b84a20;letter-spacing:1px;}
.modal-body{padding:24px 28px;}
.modal-sec-lbl{font-family:'DM Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a6550;margin-bottom:10px;font-weight:500;}
.modal-desc{font-size:16px;color:#2a1508;line-height:1.8;background:#f8f3ee;border:1px solid #ede0d0;border-radius:10px;padding:16px 18px;margin-bottom:22px;}
.modal-issues{display:flex;flex-direction:column;gap:8px;margin-bottom:22px;}
.modal-issue{background:#f8f3ee;border:1px solid #ede0d0;border-radius:8px;padding:12px 14px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.modal-issue-txt{flex:1;font-size:15px;font-weight:600;color:#2a1508;min-width:120px;}
.modal-depts{display:flex;gap:8px;flex-wrap:wrap;}

/* ══════════════════ EMPTY / LOADING ══════════════════ */
.empty{text-align:center;padding:56px 20px;}
.empty-ico{font-size:40px;margin-bottom:14px;}
.empty-t{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:#5c3d2a;margin-bottom:6px;}
.empty-s{font-size:14px;color:#b89080;font-family:'DM Mono',monospace;}
.loading{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:100px 20px;}
.spin{width:38px;height:38px;border:3px solid #e0cfc0;border-top:3px solid #b84a20;border-radius:50%;animation:spin 0.75s linear infinite;margin-bottom:18px;}
.load-t{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:#2a1508;}

/* ══════════════════ ANALYTICS ══════════════════ */
.analytics-wrap{padding:22px 26px 40px;}
.analytics-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;}
.analytics-wide{margin-bottom:16px;}
.chart-card{background:#fdf6ee;border:1.5px solid #e0cfc0;border-radius:14px;padding:22px 24px;box-shadow:0 2px 12px rgba(42,21,8,0.05);}
.chart-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px;}
.chart-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:#2a1508;}
.chart-sub{font-family:'DM Mono',monospace;font-size:11px;color:#8a6550;margin-top:3px;}
.chart-tag{font-family:'DM Mono',monospace;font-size:10px;padding:3px 9px;border-radius:5px;background:#fdf0eb;color:#b84a20;white-space:nowrap;}

@media(max-width:1000px){
  .sb{display:none;} .shell{margin-left:0;}
  .stat-strip{grid-template-columns:1fr 1fr;} .r-panel{display:none;}
  .analytics-grid{grid-template-columns:1fr;} .exp-grid{grid-template-columns:1fr;}
}
`;

interface Issue{issue:string;category:string;sentiment:string;priority:string;}
interface Complaint{
  _id:string;complaintId:string;name:string;roll_no:string;
  complaint_title:string;complaint_text:string;issues:Issue[];
  departments_to_notify:string[];overall_priority:string;
  total_issues:number;status:string;createdAt:string;
}
interface Stats{
  total:number;high:number;pending:number;resolved:number;
  byDepartment:{name:string;count:number}[];
  byDay:{date:string;count:number}[];
  byMonth:{label:string;Resolved:number;Pending:number}[];
}

const DEPT_COLORS=['#b84a20','#1a5c36','#1a3a6b','#b45309','#7a3a8c','#2a7a8c'];
const TT={background:'#fdf6ee',border:'1px solid #e0cfc0',borderRadius:8,fontSize:14,fontFamily:'DM Sans',color:'#2a1508'};

export default function AdminDashboard(){
  const [complaints,setComplaints]=useState<Complaint[]>([]);
  const [stats,setStats]=useState<Stats|null>(null);
  const [loading,setLoading]=useState(true);
  const [tab,setTab]=useState('complaints');
  const [search,setSearch]=useState('');
  const [dept,setDept]=useState('All');
  const [pri,setPri]=useState('All');
  const [stat,setStat]=useState('All');
  const [expanded,setExpanded]=useState<string|null>(null);
  const [resolving,setResolving]=useState<string|null>(null);
  const [modal,setModal]=useState<Complaint|null>(null);
  const nav=useNavigate();
  const token=sessionStorage.getItem('admin_token');

  useEffect(()=>{if(!token){nav('/admin');return;}fetchAll();},[]);

  async function fetchAll(){
    setLoading(true);
    try{
      const [cR,sR]=await Promise.all([
        fetch('http://localhost:5000/complaints',      {headers:{Authorization:`Bearer ${token}`}}),
        fetch('http://localhost:5000/complaints/stats',{headers:{Authorization:`Bearer ${token}`}}),
      ]);
      if(cR.status===401||cR.status===403){nav('/admin');return;}
      setComplaints(await cR.json());
      setStats(await sR.json());
    }catch{console.error('fetch failed');}
    finally{setLoading(false);}
  }

  async function resolve(id:string,e:React.MouseEvent){
    e.stopPropagation();
    setResolving(id);
    try{
      await fetch(`http://localhost:5000/complaints/${id}/resolve`,{method:'PATCH',headers:{Authorization:`Bearer ${token}`}});
      setComplaints(p=>p.map(c=>c._id===id?{...c,status:'Resolved'}:c));
      if(stats)setStats({...stats,pending:stats.pending-1,resolved:stats.resolved+1});
    }catch{console.error('resolve failed');}
    finally{setResolving(null);}
  }

  function logout(){sessionStorage.removeItem('admin_token');nav('/admin');}
  function today(){return new Date().toLocaleDateString('en-IN',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});}
  function fmtDate(d:string){return new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});}

  const T=stats?.total||1;
  const rPct=stats?Math.round(stats.resolved/T*100):0;
  const hPct=stats?Math.round(stats.high/T*100):0;
  const pPct=stats?Math.round(stats.pending/T*100):0;
  const maxDept=stats?Math.max(...stats.byDepartment.map(d=>d.count),1):1;


  const allDepts=['All',...Array.from(new Set(complaints.flatMap(c=>c.departments_to_notify)))];
  const filtered=complaints.filter(c=>{
    const s=search.toLowerCase();
    const m=!search||[c.name,c.roll_no,c.complaintId,c.complaint_text,c.complaint_title||''].some(v=>v.toLowerCase().includes(s));
    return m&&(dept==='All'||c.departments_to_notify.includes(dept))&&(pri==='All'||c.overall_priority===pri)&&(stat==='All'||c.status===stat);
  });

  const navItems=[
    {id:'complaints',ico:'≡',lbl:'Complaints',badge:stats?.pending??null},
    {id:'analytics', ico:'↗',lbl:'Analytics', badge:null},
  ];

  if(loading)return(
    <><style>{css}</style>
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#f8f3ee'}}>
      <div className="loading"><div className="spin"/><div className="load-t">Loading Dashboard...</div></div>
    </div></>
  );

  return(
    <><style>{css}</style>

    {/* MODAL */}
    {modal&&(
      <div className="modal-overlay" onClick={()=>setModal(null)}>
        <div className="modal" onClick={e=>e.stopPropagation()}>
          <div className="modal-head">
            <div className="modal-title">{modal.complaint_title||'Complaint Details'}</div>
            <button className="modal-close" onClick={()=>setModal(null)}>✕</button>
          </div>
          <div className="modal-meta">
            <span className="modal-id">{modal.complaintId}</span>
            <span style={{fontFamily:'DM Mono',fontSize:'13px',color:'#8a6550'}}>·</span>
            <span style={{fontSize:'14px',fontWeight:600,color:'#2a1508'}}>{modal.name}</span>
            <span style={{fontFamily:'DM Mono',fontSize:'12px',color:'#8a6550'}}>{modal.roll_no}</span>
            <span className={`bdg ${modal.overall_priority.toLowerCase()}`} style={{marginLeft:'auto'}}><span className="bd"/>{modal.overall_priority}</span>
            <span className={`bdg ${modal.status.toLowerCase()}`}><span className="bd"/>{modal.status}</span>
          </div>
          <div className="modal-body">
            <div className="modal-sec-lbl">Full Description</div>
            <div className="modal-desc">{modal.complaint_text}</div>

            {modal.issues.length>0&&(<>
              <div className="modal-sec-lbl">Detected Issues · {modal.total_issues}</div>
              <div className="modal-issues">
                {modal.issues.map((iss,i)=>(
                  <div key={i} className="modal-issue">
                    <span className="exp-inum">#{i+1}</span>
                    <div className="modal-issue-txt">{iss.issue}</div>
                    <span className="dchip">{iss.category}</span>
                    <span className={`bdg ${iss.sentiment.toLowerCase()}`}><span className="bd"/>{iss.sentiment}</span>
                    <span className={`bdg ${iss.priority.toLowerCase()}`}><span className="bd"/>{iss.priority}</span>
                  </div>
                ))}
              </div>
            </>)}

            <div className="modal-sec-lbl">Departments Notified</div>
            <div className="modal-depts">
              {modal.departments_to_notify.map(d=>(
                <div key={d} className="exp-dept"><div className="exp-ddot"/>{d}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}

    <div className="root">

      {/* SIDEBAR */}
      <aside className="sb">
        <div className="sb-logo">
          <div className="sb-mark">🎓</div>
          <div><div className="sb-name">Grievance Portal</div><div className="sb-tag">ADMIN PANEL</div></div>
        </div>
        <div className="sb-sec">
          <div className="sb-sec-lbl">Menu</div>
          {navItems.map(item=>(
            <div key={item.id} className={`sbi ${tab===item.id?'on':''}`} onClick={()=>setTab(item.id)}>
              <span className="sbi-ico">{item.ico}</span>
              <span className="sbi-lbl">{item.lbl}</span>
              {item.badge!==null&&item.badge>0&&<span className="sb-badge">{item.badge}</span>}
            </div>
          ))}
        </div>
        <div className="sb-div"/>
        <div className="sb-foot">
          <div className="sb-online"><div className="sb-dot"/><div className="sb-online-txt">MongoDB Live</div></div>
          <button className="sb-logout" onClick={logout}>Sign Out →</button>
        </div>
      </aside>

      {/* SHELL */}
      <div className="shell">
        <div className="topbar">
          <div className="topbar-t">{tab==='complaints'?'Complaints':'Analytics'}</div>
          <div className="topbar-r">
            <div className="topbar-date">{today()}</div>
            <button className="top-btn" onClick={fetchAll}>↻ Refresh</button>
          </div>
        </div>

        {/* STAT STRIP — always visible */}
        {stats&&(
          <div className="stat-strip">
            <div className="sc t">
              <div className="sc-top"><div className="sc-ico">📋</div><span className="sc-pct">{rPct}% resolved</span></div>
              <div className="sc-lbl">Total</div><div className="sc-val">{stats.total}</div>
              <div className="sc-bar"><div className="sc-bar-fill" style={{width:`${rPct}%`}}/></div>
            </div>
            <div className="sc h">
              <div className="sc-top"><div className="sc-ico">🔴</div><span className="sc-pct">{hPct}% of total</span></div>
              <div className="sc-lbl">High Priority</div><div className="sc-val">{stats.high}</div>
              <div className="sc-bar"><div className="sc-bar-fill" style={{width:`${hPct}%`}}/></div>
            </div>
            <div className="sc p">
              <div className="sc-top"><div className="sc-ico">⏳</div><span className="sc-pct">{pPct}% of total</span></div>
              <div className="sc-lbl">Pending</div><div className="sc-val">{stats.pending}</div>
              <div className="sc-bar"><div className="sc-bar-fill" style={{width:`${pPct}%`}}/></div>
            </div>
            <div className="sc r">
              <div className="sc-top"><div className="sc-ico">✅</div><span className="sc-pct">{rPct}% of total</span></div>
              <div className="sc-lbl">Resolved</div><div className="sc-val">{stats.resolved}</div>
              <div className="sc-bar"><div className="sc-bar-fill" style={{width:`${rPct}%`}}/></div>
            </div>
          </div>
        )}

        <div className="body">

          {/* ═══ COMPLAINTS TAB ═══ */}
          {tab==='complaints'&&(
            <>
              <div className="content">
                <div className="filters">
                  <div className="srch">
                    <span className="srch-ico">🔍</span>
                    <input className="srch-inp" placeholder="Search name, roll no, ID, title..." value={search} onChange={e=>setSearch(e.target.value)}/>
                  </div>
                  <select className="fsel" value={dept} onChange={e=>setDept(e.target.value)}>
                    {allDepts.map(d=><option key={d}>{d}</option>)}
                  </select>
                  <select className="fsel" value={pri} onChange={e=>setPri(e.target.value)}>
                    <option>All</option><option>High</option><option>Low</option>
                  </select>
                  <select className="fsel" value={stat} onChange={e=>setStat(e.target.value)}>
                    <option>All</option><option>Pending</option><option>Resolved</option>
                  </select>
                  <div className="fcount">{filtered.length} / {complaints.length}</div>
                </div>

                {filtered.length===0?(
                  <div className="empty">
                    <div className="empty-ico">📭</div>
                    <div className="empty-t">No complaints found</div>
                    <div className="empty-s">Try adjusting your filters</div>
                  </div>
                ):(
                  <div className="tcard">
                    <table>
                      <thead>
                        <tr>
                          <th>Complaint ID</th>
                          <th>Student</th>
                          <th>Title</th>
                          <th>Departments</th>
                          <th>Priority</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((c,idx)=>{
                          const isOpen=expanded===c._id;
                          const done=c.status==='Resolved';
                          return(
                            <>
                              <tr key={c._id} className={isOpen?'open':''} style={{animationDelay:`${idx*25}ms`}}
                                onClick={()=>setExpanded(isOpen?null:c._id)}>
                                <td><div className="cid">{c.complaintId}</div></td>
                                <td>
                                  <div className="cname">{c.name}</div>
                                  <div className="croll">{c.roll_no}</div>
                                </td>
                                <td>
                                  <div className="ctitle">{c.complaint_title||'—'}</div>
                                </td>
                                <td>
                                  {c.departments_to_notify.slice(0,2).map(d=><span key={d} className="dchip">{d}</span>)}
                                  {c.departments_to_notify.length>2&&<span className="dchip">+{c.departments_to_notify.length-2}</span>}
                                </td>
                                <td><span className={`bdg ${c.overall_priority.toLowerCase()}`}><span className="bd"/>{c.overall_priority}</span></td>
                                <td><span className={`bdg ${done?'resolved':'pending'}`}><span className="bd"/>{done?'Resolved':'Pending'}</span></td>
                                <td><div className="cdate">{fmtDate(c.createdAt)}</div></td>
                                <td onClick={e=>e.stopPropagation()}>
                                  <span className="chevron" style={{marginLeft:0,marginRight:8}}>{isOpen?'▲':'▼'}</span>
                                </td>
                              </tr>

                              {isOpen&&(
                                <tr key={`${c._id}-x`} className="xrow">
                                  <td colSpan={8}>
                                    <div className="xinn">
                                      <div className="exp-grid">
                                        <div>
                                          <div className="exp-sec-lbl">Full Description</div>
                                          <div className="exp-text">{c.complaint_text}</div>
                                        </div>
                                        <div>
                                          <div className="exp-sec-lbl">Detected Issues · {c.total_issues}</div>
                                          <div className="exp-issues">
                                            {c.issues.map((iss,i)=>(
                                              <div key={i} className="exp-issue">
                                                <span className="exp-inum">#{i+1}</span>
                                                <div className="exp-itxt">{iss.issue}</div>
                                                <span className="dchip">{iss.category}</span>
                                                <span className={`bdg ${iss.sentiment.toLowerCase()}`}><span className="bd"/>{iss.sentiment}</span>
                                                <span className={`bdg ${iss.priority.toLowerCase()}`}><span className="bd"/>{iss.priority}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="exp-sec-lbl">Departments Notified</div>
                                      <div className="exp-depts">
                                        {c.departments_to_notify.map(d=>(
                                          <div key={d} className="exp-dept"><div className="exp-ddot"/>{d}</div>
                                        ))}
                                      </div>

                                      <div className="exp-actions">
                                        <button
                                          className="res-btn"
                                          disabled={done||resolving===c._id}
                                          onClick={e=>resolve(c._id,e)}
                                        >
                                          {resolving===c._id?'Resolving...' : done?'✓ Resolved':'Mark as Resolved'}
                                        </button>
                                        <button className="view-btn" onClick={e=>{e.stopPropagation();setModal(c);}}>
                                          View Full Complaint ↗
                                        </button>
                                        <div className="exp-ts">{fmtDate(c.createdAt)}</div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* RIGHT PANEL */}
              {stats&&(
                <div className="r-panel">
                  <div className="rp-title">Quick Stats</div>
                  <div className="rp-sub">Live overview</div>
                  <div className="rp-row"><div className="rp-lbl">Total</div><div className="rp-val tv">{stats.total}</div></div>
                  <div className="rp-row"><div className="rp-lbl">High Priority</div><div className="rp-val hv">{stats.high}</div></div>
                  <div className="rp-row"><div className="rp-lbl">Pending</div><div className="rp-val pv">{stats.pending}</div></div>
                  <div className="rp-row"><div className="rp-lbl">Resolved</div><div className="rp-val rv">{stats.resolved}</div></div>
                  <div className="rp-div"/>
                  <div className="rp-sec-lbl">By Department</div>
                  {stats.byDepartment.map((d,i)=>(
                    <div key={d.name} className="dept-item">
                      <div className="dept-row-wrap">
                        <div className="dept-name">{d.name}</div>
                        <div className="dept-num">{d.count}</div>
                      </div>
                      <div className="dept-track">
                        <div className="dept-fill" style={{width:`${Math.round(d.count/maxDept*100)}%`,background:DEPT_COLORS[i%6]}}/>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ═══ ANALYTICS TAB ═══ */}
          {tab==='analytics'&&stats&&(
            <div className="analytics-wrap" style={{flex:1,overflowY:'auto'}}>

              {/* Row 1 — Bar + Donut */}
              <div className="analytics-grid">
                <div className="chart-card">
                  <div className="chart-head">
                    <div><div className="chart-title">Volume by Department</div><div className="chart-sub">Total complaints per dept</div></div>
                    <span className="chart-tag">All Time</span>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={stats.byDepartment} margin={{top:4,right:8,left:-22,bottom:0}}>
                      <XAxis dataKey="name" tick={{fontSize:13,fill:'#5c3d2a',fontFamily:'DM Mono'}}/>
                      <YAxis tick={{fontSize:12,fill:'#8a6550'}} allowDecimals={false}/>
                      <Tooltip contentStyle={TT}/>
                      <Bar dataKey="count" radius={[6,6,0,0]}>
                        {stats.byDepartment.map((_,i)=><Cell key={i} fill={DEPT_COLORS[i%6]}/>)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-card">
                  <div className="chart-head">
                    <div><div className="chart-title">Resolution Rate</div><div className="chart-sub">Resolved vs Pending</div></div>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={[{name:'Resolved',value:stats.resolved},{name:'Pending',value:stats.pending}]}
                        cx="50%" cy="46%" innerRadius={65} outerRadius={95}
                        dataKey="value" paddingAngle={4}>
                        <Cell fill="#1a5c36"/><Cell fill="#b45309"/>
                      </Pie>
                      <Tooltip contentStyle={TT}/>
                      <Legend iconType="circle" iconSize={9} wrapperStyle={{fontSize:13,fontFamily:'DM Mono',color:'#5c3d2a'}}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Row 2 — Monthly Resolved vs Pending stacked area */}
              {stats.byMonth&&stats.byMonth.length>=0&&(
                <div className="analytics-wide">
                  <div className="chart-card">
                    <div className="chart-head">
                      <div><div className="chart-title">Monthly Resolved vs Pending</div><div className="chart-sub">6-month breakdown of complaint resolution</div></div>
                      <span className="chart-tag">6 Months</span>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                      <AreaChart data={stats.byMonth} margin={{top:4,right:8,left:-22,bottom:0}}>
                        <defs>
                          <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#1a5c36" stopOpacity={0.35}/>
                            <stop offset="95%" stopColor="#1a5c36" stopOpacity={0.05}/>
                          </linearGradient>
                          <linearGradient id="gradPending" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#b45309" stopOpacity={0.35}/>
                            <stop offset="95%" stopColor="#b45309" stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ede0d0"/>
                        <XAxis dataKey="label" tick={{fontSize:13,fill:'#5c3d2a',fontFamily:'DM Mono'}}/>
                        <YAxis tick={{fontSize:12,fill:'#8a6550'}} allowDecimals={false}/>
                        <Tooltip contentStyle={TT}/>
                        <Legend iconType="circle" iconSize={9} wrapperStyle={{fontSize:13,fontFamily:'DM Mono',color:'#5c3d2a'}}/>
                        <Area type="monotone" dataKey="Resolved" stackId="1" stroke="#1a5c36" strokeWidth={2.5} fill="url(#gradResolved)" dot={{fill:'#1a5c36',r:4,strokeWidth:2,stroke:'#fdf6ee'}}/>
                        <Area type="monotone" dataKey="Pending"  stackId="1" stroke="#b45309" strokeWidth={2.5} fill="url(#gradPending)"  dot={{fill:'#b45309',r:4,strokeWidth:2,stroke:'#fdf6ee'}}/>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Row 3 — 7-day trend */}
              {stats.byDay.length>0&&(
                <div className="analytics-wide">
                  <div className="chart-card">
                    <div className="chart-head">
                      <div><div className="chart-title">7-Day Complaint Trend</div><div className="chart-sub">Submission volume over last 7 days</div></div>
                      <span className="chart-tag">7 Days</span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={stats.byDay} margin={{top:4,right:8,left:-22,bottom:0}}>
                        <defs>
                          <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#b84a20" stopOpacity={0.18}/>
                            <stop offset="95%" stopColor="#b84a20" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ede0d0"/>
                        <XAxis dataKey="date" tick={{fontSize:12,fill:'#8a6550',fontFamily:'DM Mono'}}/>
                        <YAxis tick={{fontSize:12,fill:'#8a6550'}} allowDecimals={false}/>
                        <Tooltip contentStyle={TT}/>
                        <Area type="monotone" dataKey="count" stroke="#b84a20" strokeWidth={2.5}
                          fill="url(#ag)" dot={{fill:'#b84a20',r:5,strokeWidth:2,stroke:'#fdf6ee'}}/>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
    </>
  );
}