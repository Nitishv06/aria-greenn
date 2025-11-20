// --- Aria Onboarding Backend (v1.2 compliant) ---
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// --- Paths to store user data ---
const DATA_DIR = path.join(__dirname, "..", "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const RAW_FILE = path.join(DATA_DIR, "raw_signals.json");
const INFERENCES_FILE = path.join(DATA_DIR, "inferences.json");

// --- Ensure data folder exists ---
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// --- Safely read JSON file ---
function readJSON(filePath) {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// --- Safely write JSON file ---
function writeJSON(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// --- Health Check API ---
app.get("/", (req, res) => {
    res.send("Aria Onboarding Backend is Running 🚀");
});

// --- Submit Survey API ---
// --- Main Survey API: store answers + return inference ---
app.post("/submit-survey", (req, res) => {
  const payload = req.body;
  console.log("Incoming Survey:", payload);

  // make sure we always have these
  const userId = payload.userId || `user-${Date.now()}`;
  const answers = payload.answers || {};

  // read existing JSON data from files
  const users = readJSON(USERS_FILE);
  const raws = readJSON(RAW_FILE);
  const inferences = readJSON(INFERENCES_FILE);

  // very simple fake "inference" – this is what frontend will show
  const inference = {
    userId,
    archetype: "Explorer",
    motivationalProfile: "Growth",
    stressPattern: "Low",
  };

  // store data in arrays
  users.push({
    userId,
    answers,
    createdAt: new Date().toISOString(),
  });

  raws.push({
    userId,
    raw: payload,
    createdAt: new Date().toISOString(),
  });

  inferences.push(inference);

  // write back to JSON files
  writeJSON(USERS_FILE, users);
  writeJSON(RAW_FILE, raws);
  writeJSON(INFERENCES_FILE, inferences);

  // send response to frontend
  res.json({
    message: "Survey stored successfully",
    inference,
  });
});

// --- Start server ---
app.listen(5000, () => {
  console.log("🚀 Backend running at http://localhost:5000");
});

