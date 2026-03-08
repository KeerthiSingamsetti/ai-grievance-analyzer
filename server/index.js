import express from "express";
import cors from "cors";
import { analyzeComplaint } from "./ai.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Grievance Analyzer Backend Running");
});

app.post("/analyze", async (req, res) => {

  console.log("Incoming request:", req.body);

  const complaint = req.body.text;

  if (!complaint) {
    return res.json({
      category: "None",
      sentiment: "None",
      priority: "None"
    });
  }

  try {

    const result = await analyzeComplaint(complaint);

    console.log("AI RESULT:", result);

    res.json(result);

  } catch (error) {

    console.error("AI ERROR:", error);

    res.status(500).json({
      category: "Error",
      sentiment: "Error",
      priority: "Error"
    });

  }

});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});