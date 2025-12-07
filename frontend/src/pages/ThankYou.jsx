import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scores = location.state?.scores;

  // Handle cases where scores are not passed
  if (!scores) {
    return (
      <div className="thank-you-container">
        <h1>Thank You!</h1>
        <p>Your survey has been submitted.</p>
        <p>There was an issue processing your scores. Please try again.</p>
        <button onClick={() => navigate('/')} className="nav-button primary">
          Return to Survey
        </button>
      </div>
    );
  }

  // Destructure the scores for easier access
  const {
    derived: {
      motivational_profile,
      stress_pattern,
      archetype: {
        group,
        primary,
        secondary,
        tertiary
      }
    }
  } = scores;

  return (
    <div className="thank-you-container">
      <h1>Thank You for Completing the Survey!</h1>
      <p>Your responses have been recorded. Here’s a summary of your results:</p>

      <div className="results-section">
        <h2>Your Archetype: {group}</h2>
        <ul>
          <li><strong>Primary:</strong> {primary.label} ({Math.round(primary.weight * 100)}%)</li>
          <li><strong>Secondary:</strong> {secondary.label} ({Math.round(secondary.weight * 100)}%)</li>
          <li><strong>Tertiary:</strong> {tertiary.label} ({Math.round(tertiary.weight * 100)}%)</li>
        </ul>
      </div>

      <div className="results-section">
        <h2>Your Motivational Profile</h2>
        <p>Your primary motivational focus is <strong>{motivational_profile.label}</strong> (Confidence: {Math.round(motivational_profile.confidence * 100)}%).</p>
      </div>

      <div className="results-section">
        <h2>Your Stress Pattern</h2>
        <p>Under pressure, you tend towards a <strong>{stress_pattern.label}</strong> pattern (Confidence: {Math.round(stress_pattern.confidence * 100)}%).</p>
      </div>

      <button onClick={() => navigate('/')} className="nav-button primary">
        Take the Survey Again
      </button>
    </div>
  );
};

export default ThankYou;
