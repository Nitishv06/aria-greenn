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
app.post("/submit-survey", (req, res) => {
    const userData = req.body;

    console.log("📥 Incoming Survey:", userData);

    // Save raw user data
    const raw = readJSON(RAW_FILE);
    raw.push(userData);
    writeJSON(RAW_FILE, raw);

    // Create simple inference (PLACEHOLDER LOGIC)
    const inference = {
        userId: userData.userId || Date.now(),
        archetype: "Explorer",
        motivationalProfile: "Growth",
        stressPattern: "Low"
    };

    // Save inference
    const inf = readJSON(INFERENCES_FILE);
    inf.push(inference);
    writeJSON(INFERENCES_FILE, inf);

    // Save user record
    const users = readJSON(USERS_FILE);
    users.push({
        ...userData,
        inference: inference
    });
    writeJSON(USERS_FILE, users);

    res.json({
        message: "Survey stored successfully",
        inference: inference
    });
});

// --- Start Server ---
app.listen(5000, () => {
    console.log("🚀 Backend running at http://localhost:5000");
});
