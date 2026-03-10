# 🎓 AI Grievance Analyzer

> An intelligent campus complaint management system that uses AI to automatically analyze, categorize, prioritize, and route student grievances to the correct departments — with real-time email notifications and a full admin dashboard.
## 📌 Overview

Students often don't know which department to contact for their complaints. This system solves that — a student simply describes their issue in plain text, and the AI figures out everything else: what the issues are, how serious they are, and which departments need to act.

Built as a full-stack project with a Python ML backend, Node.js API, MongoDB Atlas database, and a React TypeScript frontend.

---

## ✨ Features

### Student Side
- Submit complaints with a **title + detailed description**
- AI instantly analyzes the complaint and detects **multiple issues** within a single submission
- Each issue is classified by **category**, **sentiment**, and **priority**
- Auto-routes to the correct departments (Network, Electrical, Mess, Infrastructure, Academic, Administration)
- Student receives a unique **GRV-XXXX tracking ID**
- **Track complaint status** anytime using the tracking ID — 5-step progress indicator

### Admin Side
- Secure **JWT-based login**
- Full complaints table with **search, filter by department / priority / status**
- **Expandable rows** — click any complaint to see full details inline
- **View Full Complaint modal** — title, description, all detected issues, departments
- **Mark as Resolved** with one click
- Analytics dashboard:
  - Volume by Department (bar chart)
  - Resolution Rate (donut chart)
  - Monthly Resolved vs Pending (stacked area chart)
  - 7-Day Complaint Trend (area chart)

### Automation
- **Email notifications** sent automatically to each department on complaint submission
- Beautiful HTML emails with complaint details, detected issues table, student info
- Non-blocking — email failures never crash the server

---

## 🧠 AI / ML Pipeline

The AI pipeline runs in Python and is called by the Node.js backend via a child process:

```
Student text input
      ↓
NLTK preprocessing (tokenization, stopword removal, lemmatization)
      ↓
Issue splitting (sentences / clauses)
      ↓
TF-IDF vectorizer → Naive Bayes classifier → category prediction
      ↓
DistilBERT (HuggingFace Transformers) → sentiment analysis
      ↓
Priority assignment (Negative sentiment + certain categories → High)
      ↓
Department mapping (category → department)
      ↓
JSON result returned to Node.js
```

**Categories:** Network · Electrical · Mess · Infrastructure · Academic · Administration · General

**Models used:**
- `sklearn` Multinomial Naive Bayes + TF-IDF for category classification
- `distilbert-base-uncased-finetuned-sst-2-english` for sentiment analysis
- Custom trained on `grievance_dataset.csv`

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Plain CSS (no Tailwind) — custom design system |
| Charts | Recharts |
| Backend | Node.js + Express |
| AI Bridge | Python child process via `spawn` |
| ML / NLP | Python · scikit-learn · NLTK · HuggingFace Transformers |
| Database | MongoDB Atlas (cloud) + Mongoose ODM |
| Auth | JWT (8h expiry) + bcrypt |
| Email | Nodemailer + Gmail SMTP |
| Fonts | Playfair Display · DM Sans · DM Mono |

---

## 📁 Project Structure

```
ai-grievance-analyzer/
│
├── client/                        # React frontend
│   └── src/
│       ├── pages/
│       │   ├── StudentPage.tsx    # Complaint submission
│       │   ├── TrackPage.tsx      # Track by GRV-XXXX
│       │   ├── AdminLogin.tsx     # Admin auth
│       │   └── AdminDashboard.tsx # Admin panel + analytics
│       └── App.tsx                # Routes
│
└── server/                        # Node.js backend
    ├── index.js                   # Express app + /analyze route
    ├── ai.js                      # Python bridge (spawn)
    ├── ai_model.py                # ML pipeline (Python)
    ├── grievance_dataset.csv      # Training data
    ├── config/
    │   └── db.js                  # MongoDB connection
    ├── models/
    │   └── Complaint.js           # Mongoose schema
    ├── routes/
    │   └── complaints.js          # Admin API routes
    ├── middleware/
    │   └── auth.js                # JWT middleware
    └── utils/
        └── emailService.js        # Nodemailer email service
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Python 3.9+
- MongoDB Atlas account (free tier works)
- Gmail account (for email notifications)

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/ai-grievance-analyzer.git
cd ai-grievance-analyzer
```

### 2. Install Python dependencies
```bash
cd server
pip install scikit-learn nltk transformers torch pandas numpy
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"
```

### 3. Install Node dependencies
```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 4. Configure environment variables
Create `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
ADMIN_PASSWORD=your_admin_password

# Email (optional — skip to disable notifications)
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password

# Department emails
EMAIL_NETWORK=network@college.edu
EMAIL_ELECTRICAL=electrical@college.edu
EMAIL_MESS=mess@college.edu
EMAIL_INFRASTRUCTURE=infra@college.edu
EMAIL_ACADEMIC=academic@college.edu
EMAIL_ADMINISTRATION=admin@college.edu
```

> **Gmail App Password:** Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) → generate a 16-character app password. Use this as `EMAIL_PASS`, not your real Gmail password.

### 5. Train the ML model
```bash
cd server
python ai_model.py
```

### 6. Run the project
```bash
# Terminal 1 — Backend
cd server
node index.js

# Terminal 2 — Frontend
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/analyze` | None | Submit + analyze complaint |
| `POST` | `/auth/login` | None | Admin login → JWT token |
| `GET` | `/complaints` | JWT | Get all complaints |
| `GET` | `/complaints/stats` | JWT | Stats + chart data |
| `GET` | `/complaints/track/:id` | None | Public complaint tracking |
| `PATCH` | `/complaints/:id/resolve` | JWT | Mark complaint resolved |

---

## 📸 Screenshots

> Add screenshots of StudentPage, TrackPage, AdminDashboard, and email here

---

## 🗺 Roadmap

- [x] ML pipeline — category + sentiment + priority
- [x] Multi-issue detection from single complaint
- [x] MongoDB persistence
- [x] JWT admin authentication
- [x] Student complaint tracking
- [x] Admin dashboard with analytics
- [x] Email notifications to departments

---

## 👤 Author

**Your Name**
- GitHub: https://github.com/KeerthiSingamsetti
- LinkedIn: https://www.linkedin.com/in/keerthi-singamsetti-063173300/

---
