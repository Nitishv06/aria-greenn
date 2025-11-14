// Simple backend server for Aria Onboarding

const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// --- Test API (to check server is running) ---
app.get("/", (req, res) => {
  res.send("Aria Onboarding Backend is Working! 🚀");
});

// --- API to receive user answers ---
app.post("/submit-survey", (req, res) => {
  const userData = req.body;

  console.log("User Submitted:", userData);

  res.json({
    message: "Survey received!",
    receivedData: userData
  });
});

// --- Start the server ---
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
