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
| Charts | Recharts |
| Backend | Node.js + Express |
| Category ML | scikit-learn — Multinomial Naive Bayes + TF-IDF |
| Priority ML | scikit-learn — Logistic Regression + TF-IDF |
| Sentiment | HuggingFace Transformers — DistilBERT |
| NLP | NLTK (tokenization, stopwords, lemmatization) |
| Database | MongoDB Atlas + Mongoose ODM |
| Auth | JWT (8h expiry) |
| Email | Nodemailer + Gmail SMTP |

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
