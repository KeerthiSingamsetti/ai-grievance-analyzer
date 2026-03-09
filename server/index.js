import 'dotenv/config';
import express              from "express";
import cors                 from "cors";
import jwt                  from "jsonwebtoken";
import { analyzeComplaint } from "./ai.js";
import { connectDB }        from "./config/db.js";
import Complaint            from "./models/Complaint.js";
import complaintRoutes      from "./routes/complaints.js";
import { sendDepartmentEmails } from "./utils/emailService.js";

const app = express();

// ── Connect MongoDB
connectDB();

// ── Middleware
app.use(cors());
app.use(express.json());

// ── Complaint routes (for admin)
app.use("/complaints", complaintRoutes);

// ── Health check
app.get("/", (req, res) => {
  res.send("AI Grievance Analyzer Backend Running");
});

// ── Admin Login
app.post("/auth/login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({ token });
});

// ── Generate unique complaint ID
function generateComplaintId() {
  return "GRV-" + Math.floor(1000 + Math.random() * 9000);
}

// ── POST /analyze
// your existing logic — now also saves to MongoDB
app.post("/analyze", async (req, res) => {

  console.log("Incoming request:", req.body);

  const { text, name, roll_no, complaint_title } = req.body;

  if (!text) {
    return res.json({
      total_issues          : 0,
      overall_priority      : "None",
      departments_to_notify : [],
      issues                : []
    });
  }

  try {

    // your existing AI call — completely unchanged ✅
    const result = await analyzeComplaint(text);
    console.log("AI RESULT:", result);

    // NEW — save complaint to MongoDB
    const complaint = new Complaint({
      complaintId          : generateComplaintId(),
      name                 : name    || "Anonymous",
      roll_no              : roll_no || "N/A",
      complaint_title      : complaint_title  || "",
      complaint_text       : text,
      issues               : result.issues,
      departments_to_notify: result.departments_to_notify,
      overall_priority     : result.overall_priority,
      total_issues         : result.total_issues,
      status               : "Pending",
    });

    await complaint.save();
    console.log("✅ Saved to MongoDB:", complaint.complaintId);

    // ── Send email notifications to departments (non-blocking)
    sendDepartmentEmails(complaint, result.issues, result.departments_to_notify)
      .catch(err => console.error("Email error:", err));

    // return AI result + complaintId to frontend
    res.json({
      ...result,
      complaintId: complaint.complaintId,
    });

  } catch (error) {

    console.error("AI ERROR:", error);

    res.status(500).json({
      total_issues          : 0,
      overall_priority      : "Error",
      departments_to_notify : [],
      issues                : []
    });

  }

});

// ── Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});