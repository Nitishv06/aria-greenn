import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ---------------- Voice preference config ----------------

const VOICE_OPTIONS = [
  { code: "clinical", label: "Clinical" },
  { code: "plain", label: "Plain" },
  { code: "relational", label: "Relational" },
  { code: "metaphor", label: "Metaphorical" },
  { code: "spiritual", label: "Spiritual" },
];

// ---------------- Survey questions from v1.2 JSON ----------------
// We use choice keys (A, B, C, D) because the scoring logic is usually based on these.

const QUESTION_MAP = {
  role: {
    id: "role",
    title: "Do you lead others?",
    description: "",
    choices: [
      { key: "A", label: "Yes" },
      { key: "B", label: "No" },
    ],
  },
  Q1: {
    id: "Q1",
    title: "Your first move on a new problem?",
    description: "",
    choices: [
      { key: "A", label: "Break into steps" },
      { key: "B", label: "Ask clarifying questions" },
      { key: "C", label: "Explore for patterns" },
      { key: "D", label: "Define ideal end state & reverse-engineer" },
    ],
  },
  Q2: {
    id: "Q2",
    title: "When misunderstood, you tend to...",
    description: "",
    choices: [
      { key: "A", label: "Explain more clearly" },
      { key: "B", label: "Retreat and regroup" },
      { key: "C", label: "Use analogy or story" },
      { key: "D", label: "Ask what they meant" },
    ],
  },
  Q3A: {
    id: "Q3A",
    title: "When stressed, what helps you move forward?",
    description: "",
    choices: [
      { key: "A", label: "Space alone" },
      { key: "B", label: "Talk to a trusted person" },
      { key: "C", label: "Create a structure" },
      { key: "D", label: "Reconnect to purpose" },
    ],
  },
  Q3B: {
    id: "Q3B",
    title: "When stressed, what do you want most from a manager?",
    description: "",
    choices: [
      { key: "A", label: "Protect my time" },
      { key: "B", label: "Empathy first" },
      { key: "C", label: "Break it into steps" },
      { key: "D", label: "Define clear outcomes" },
    ],
  },
  Q4: {
    id: "Q4",
    title: "In conflict, you tend to...",
    description: "",
    choices: [
      { key: "A", label: "Solve fast" },
      { key: "B", label: "Preserve harmony" },
      { key: "C", label: "Put truth on the table" },
      { key: "D", label: "Avoid escalation" },
    ],
  },
  Q5: {
    id: "Q5",
    title: "Feedback resonates best when it’s...",
    description: "",
    choices: [
      { key: "A", label: "Direct and specific" },
      { key: "B", label: "Warm and considerate" },
      { key: "C", label: "Insightful or conceptual" },
      { key: "D", label: "Reflective or questioning" },
    ],
  },
  Q6: {
    id: "Q6",
    title: "When things are ambiguous, you usually...",
    description: "",
    choices: [
      { key: "A", label: "Negotiate clarity" },
      { key: "B", label: "Observe longer" },
      { key: "C", label: "Experiment until a pattern emerges" },
      { key: "D", label: "Narrow to what’s known" },
    ],
  },
  Q7: {
    id: "Q7",
    title: "What drains you fastest?",
    description: "",
    choices: [
      { key: "A", label: "Losing autonomy" },
      { key: "B", label: "Emotional pull from others" },
      { key: "C", label: "Forced conformity" },
      { key: "D", label: "Unclear expectations" },
    ],
  },
  Q8: {
    id: "Q8",
    title: "What energizes you most?",
    description: "",
    choices: [
      { key: "A", label: "Autonomy" },
      { key: "B", label: "Connection" },
      { key: "C", label: "Challenge" },
      { key: "D", label: "Purpose" },
    ],
  },
  Q9: {
    id: "Q9",
    title: "When you freeze, it’s usually because...",
    description: "",
    choices: [
      { key: "A", label: "Too many details" },
      { key: "B", label: "Social risk" },
      { key: "C", label: "Lack of inspiring direction" },
      { key: "D", label: "Unclear success metrics" },
    ],
  },
  Q10: {
    id: "Q10",
    title: "A workplace feels like 'home' when it offers...",
    description: "",
    choices: [
      { key: "A", label: "Structure" },
      { key: "B", label: "Intimacy" },
      { key: "C", label: "Possibility" },
      { key: "D", label: "Precision" },
    ],
  },
};

// Build the ordered flow of questions AFTER voice preference.
// We include role, then Q1, Q2, Q3A/B (depending on role), then Q4..Q10.

function buildQuestionFlow(roleChoice) {
  const flow = [];

  // 1) Role question
  flow.push(QUESTION_MAP.role);

  // 2) Q1, Q2
  flow.push(QUESTION_MAP.Q1);
  flow.push(QUESTION_MAP.Q2);

  // 3) Q3A or Q3B depending on roleChoice
  if (roleChoice === "A") {
    // A = "Yes" => Manager => wants Q3B
    flow.push(QUESTION_MAP.Q3B);
  } else {
    // default to Q3A (IC) if role is "B" or not answered yet
    flow.push(QUESTION_MAP.Q3A);
  }

  // 4) Q4–Q10
  flow.push(
    QUESTION_MAP.Q4,
    QUESTION_MAP.Q5,
    QUESTION_MAP.Q6,
    QUESTION_MAP.Q7,
    QUESTION_MAP.Q8,
    QUESTION_MAP.Q9,
    QUESTION_MAP.Q10
  );

  return flow;
}

// ---------------- Component ----------------

export default function SurveyForm() {
  const navigate = useNavigate();

  // Basic info (optional, client didn’t demand but fine to keep)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Voice preference
  const [voicePref, setVoicePref] = useState(null); // code: "clinical" | ...

  // Step state: 1 = voice screen, 2+ = questions
  const [step, setStep] = useState(1);

  // answers: { role: "A", Q1: "B", ... }
  const [answers, setAnswers] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Build the current question flow using role answer (for Q3A/B)
  const questionFlow = buildQuestionFlow(answers.role);
  const totalSteps = 1 + questionFlow.length; // 1 = voice, then all questions

  // Map current step (>=2) to question index
  const currentQuestionIndex = step - 2; // step 2 => index 0
  const currentQuestion =
    step >= 2 && step <= totalSteps ? questionFlow[currentQuestionIndex] : null;

  // ----- Handlers -----

  function handleVoiceClick(optionCode) {
    setVoicePref(optionCode);
  }

  function handleAnswerClick(questionId, choiceKey) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: choiceKey,
    }));
  }

  function canGoNext() {
    if (step === 1) {
      // Voice preference is required
      return Boolean(voicePref);
    }
    if (!currentQuestion) return false;
    return Boolean(answers[currentQuestion.id]);
  }

  function handleNext() {
    if (step < totalSteps) {
      setStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  }

  function handleBack() {
    if (step > 1 && !isSubmitting) {
      setStep((s) => s - 1);
    }
  }

  async function handleSubmit() {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Derive IC / Manager from role answer
      const roleChoice = answers.role; // "A" or "B"
      const roleGroup = roleChoice === "A" ? "Manager" : "IC";

      // Turn answers object into an array of { id, choice }
      const responseArray = Object.entries(answers).map(([id, choice]) => ({
        id,
        choice,
      }));

      const primaryUserId = email || "anon-user";

      const payload = {
        // --- Old shape (for your existing backend) ---
        userId: primaryUserId,
        answers: {
          name,
          email,
          voicePreference: voicePref, // code
          ...answers, // role, Q1..Q10 as A/B/C/D
        },

        // --- Spec-style shape (for client requirements) ---
        user_id: primaryUserId,
        voice_pref: voicePref, // "clinical" | "plain" | ...
        role: roleGroup, // "IC" | "Manager"
        responses: responseArray,
      };

      const response = await fetch("http://localhost:5000/submit-survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Backend error:", text);
        alert("Submit failed. Please try again.");
        return;
      }

      const data = await response.json();
      console.log("Response JSON:", data);

      navigate("/thanks", { state: { inference: data.inference } });
    } catch (err) {
      console.error("Network error:", err);
      alert("Something went wrong while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ----- Render -----
  return (
    <div className="survey-root">
      <div className="survey-shell">
        <header className="survey-header">
          <h1>Onboarding survey</h1>
          <p>
            Answer a few quick questions so Aria can personalise your coaching.
          </p>
        </header>

        <main>
          <div className="survey-step">
            Step {step} of {totalSteps}
          </div>

          {step === 1 ? (
            <section className="survey-question">
              {/* Optional basic info */}
              <label className="field-label">
                Name <span className="field-optional">(Optional)</span>
              </label>
              <input
                className="text-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Optional"
              />

              <label className="field-label">
                Email <span className="field-optional">(Optional)</span>
              </label>
              <input
                className="text-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Optional"
              />

              {/* Voice preference (required) */}
              <p className="helper-text">Voice preference*</p>
              <p>How do you prefer Aria to speak with you?</p>

              <div className="survey-options">
                {VOICE_OPTIONS.map((opt) => (
                  <button
                    key={opt.code}
                    type="button"
                    className={
                      "survey-option" +
                      (voicePref === opt.code ? " selected" : "")
                    }
                    onClick={() => handleVoiceClick(opt.code)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </section>
          ) : (
            currentQuestion && (
              <section className="survey-question">
                <h2>{currentQuestion.title}</h2>
                {currentQuestion.description && (
                  <p>{currentQuestion.description}</p>
                )}

                <div className="survey-options">
                  {currentQuestion.choices.map((choice) => (
                    <button
                      key={choice.key}
                      type="button"
                      className={
                        "survey-option" +
                        (answers[currentQuestion.id] === choice.key
                          ? " selected"
                          : "")
                      }
                      onClick={() =>
                        handleAnswerClick(currentQuestion.id, choice.key)
                      }
                    >
                      {choice.label}
                    </button>
                  ))}
                </div>
              </section>
            )
          )}
        </main>

        <footer className="survey-nav">
          <button
            type="button"
            className="nav-button secondary"
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
          >
            Back
          </button>

          <button
            type="button"
            className="nav-button primary"
            onClick={handleNext}
            disabled={!canGoNext() || isSubmitting}
          >
            {step === totalSteps ? "Submit" : "Next"}
          </button>
        </footer>
      </div>
    </div>
  );
}
