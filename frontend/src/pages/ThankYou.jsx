// frontend/src/pages/ThankYou.jsx
import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function ThankYou() {
  const { state } = useLocation();
  const inference = state?.inference;

  if (!inference) {
    return (
      <div style={{ maxWidth: 760, margin: "40px auto", padding: 16 }}>
        <h1>Thank you!</h1>
        <p>Your responses were submitted successfully.</p>
        <p>No inference data returned by the backend.</p>
        <p><Link to="/">Back to form</Link></p>
      </div>
    );
  }

  const { motivational_profile, stress_pattern, archetype } = inference;

  return (
    <div style={{ maxWidth: 760, margin: "40px auto", padding: 16 }}>
      <h1>Thank you!</h1>
      <p>Your responses were submitted successfully.</p>

      <section
        style={{
          background: "#fafafa",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "24px",
          boxShadow: "0 0 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ marginBottom: 12 }}>Your Personalised Insights</h2>

        {/* Archetype */}
        {archetype && (
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 6px", color: "#444" }}>Archetype</h3>
            <p style={{ fontSize: "18px", margin: 0 }}>
              <strong>{archetype.label}</strong>
            </p>
            <p style={{ margin: "4px 0 0", color: "#666" }}>
              Group: {archetype.group}
            </p>
            {archetype.confidence !== undefined && (
              <p style={{ margin: 0, color: "#999" }}>
                Confidence: {(archetype.confidence * 100).toFixed(1)}%
              </p>
            )}
          </div>
        )}

        {/* Motivational Profile */}
        {motivational_profile && (
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 6px", color: "#444" }}>
              Motivational Profile
            </h3>
            <p style={{ fontSize: "18px", margin: 0 }}>
              <strong>{motivational_profile.label}</strong>
            </p>
            {motivational_profile.confidence !== undefined && (
              <p style={{ margin: "4px 0 0", color: "#999" }}>
                Confidence: {(motivational_profile.confidence * 100).toFixed(
                  1
                )}%
              </p>
            )}
          </div>
        )}

        {/* Stress Pattern */}
        {stress_pattern && (
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 6px", color: "#444" }}>Stress Pattern</h3>
            <p style={{ fontSize: "18px", margin: 0 }}>
              <strong>{stress_pattern.label}</strong>
            </p>
            {stress_pattern.confidence !== undefined && (
              <p style={{ margin: "4px 0 0", color: "#999" }}>
                Confidence: {(stress_pattern.confidence * 100).toFixed(1)}%
              </p>
            )}
          </div>
        )}
      </section>

      <p style={{ marginTop: 20 }}>
        <Link to="/" style={{ color: "#0077ff" }}>
          Back to form
        </Link>
      </p>
    </div>
  );
}
