# 🎓 AI Grievance Analyzer

> An intelligent campus complaint management system that uses a dual ML pipeline to automatically analyze, categorize, prioritize, and route student grievances to the correct departments — with real-time email notifications and a full admin dashboard.

---

## 📌 Overview

Students often don't know which department to contact for their complaints. This system solves that — a student simply describes their issue in plain text, and the AI figures out everything else: what the issues are, how serious they are, and which departments need to act.

Built as a full-stack project with a Python dual-ML backend, Node.js API, MongoDB Atlas database, React TypeScript frontend, and automated email notifications.

---

## ✨ Features

### Student Side
- Submit complaints with a **title + detailed description**
- AI instantly analyzes and detects **multiple issues** within a single submission
- Each issue classified by **category**, **priority**, and **sentiment** independently
- Auto-routes to correct departments (Network, Electrical, Mess, Infrastructure, Academic, Administration)
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
- Beautiful HTML emails with complaint details, issues table, student info
- Non-blocking — email failures never crash the server

---

## 🧠 Dual ML Pipeline

The core of this project is a **two-model ML pipeline** running in Python, called by Node.js via a child process:

```
Student text input
      ↓
NLTK preprocessing + sentence splitting
      ↓
┌─────────────────────────────────────────────┐
│           MODEL 1 — Naive Bayes             │
│   TF-IDF (bigrams) + Multinomial NB         │
│   Trained on: grievance_dataset.csv         │
│   Output: Category                          │
│   (Network / Electrical / Mess /            │
│    Infrastructure / Academic / Admin)       │
└─────────────────────────────────────────────┘
      ↓
┌─────────────────────────────────────────────┐
│        MODEL 2 — Logistic Regression        │
│   TF-IDF (bigrams) + Logistic Regression    │
│   Trained on: priority_dataset.csv          │
│   Output: Priority (High / Low)             │
│   Independent of sentiment — purely         │
│   trained on urgency/severity patterns      │
└─────────────────────────────────────────────┘
      ↓
┌─────────────────────────────────────────────┐
│     DistilBERT (HuggingFace Transformers)   │
│   distilbert-base-uncased-finetuned-sst-2   │
│   Output: Sentiment (Positive / Negative)   │
└─────────────────────────────────────────────┘
      ↓
Jaccard similarity deduplication
      ↓
JSON result → Node.js → MongoDB + Email
```

**Why two separate models?**
- Naive Bayes excels at multi-class text classification (7 categories)
- Logistic Regression is better suited for binary classification (High/Low priority)
- DistilBERT handles nuanced sentiment that rule-based approaches miss
- Each model has its own TF-IDF vectorizer trained on domain-specific data

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Plain CSS — custom design system |
| Charts | Recharts |
| Backend | Node.js + Express |
| AI Bridge | Python child process via `spawn` |
| Category ML | scikit-learn — Multinomial Naive Bayes + TF-IDF |
| Priority ML | scikit-learn — Logistic Regression + TF-IDF |
| Sentiment | HuggingFace Transformers — DistilBERT |
| NLP | NLTK (tokenization, stopwords, lemmatization) |
| Database | MongoDB Atlas + Mongoose ODM |
| Auth | JWT (8h expiry) |
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
│       └── App.tsx
│
└── server/                        # Node.js + Python backend
    ├── index.js                   # Express app + /analyze route
    ├── ai.js                      # Python bridge (spawn)
    ├── ai_model.py                # Dual ML pipeline (Python)
    ├── grievance_dataset.csv      # Category training data (270 rows)
    ├── priority_dataset.csv       # Priority training data (295 rows)
    ├── seedComplaints.js          # Demo data seeder
    ├── config/db.js               # MongoDB connection
    ├── models/Complaint.js        # Mongoose schema
    ├── routes/complaints.js       # Admin API routes
    ├── middleware/auth.js         # JWT middleware
    └── utils/emailService.js      # Nodemailer email service
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
cd server && npm install

# Client
cd ../client && npm install
```

### 4. Configure environment variables
Create `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
ADMIN_PASSWORD=your_admin_password

# Email (optional)
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

### 5. Run the project
```bash
# Terminal 1 — Backend
cd server && node index.js

# Terminal 2 — Frontend
cd client && npm run dev
```

### 6. (Optional) Seed demo data
```bash
cd server
node seedComplaints.js          # insert 10 demo complaints
node seedComplaints.js --clear  # clear existing + insert fresh
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

## 🗺 Roadmap

- [x] Dual ML pipeline — Naive Bayes (category) + Logistic Regression (priority)
- [x] DistilBERT sentiment analysis
- [x] Multi-issue detection from single complaint
- [x] Jaccard similarity deduplication
- [x] MongoDB persistence
- [x] JWT admin authentication
- [x] Student complaint tracking
- [x] Admin dashboard with analytics
- [x] Automated email notifications
---

## 👤 Author

**Your Name**
-GitHub: https://github.com/KeerthiSingamsetti
- LinkedIn: https://www.linkedin.com/in/keerthi-singamsetti-063173300/

---
