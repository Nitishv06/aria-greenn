
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function ThankYou() {
  const { state } = useLocation();
  const scores = state?.scores;

  const containerStyle = {
    backgroundColor: '#e0f2f1',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '32px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  };

  const headingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '8px',
  };

  const subHeadingStyle = {
    color: '#555',
    marginBottom: '24px',
  };

  const sectionStyle = {
    marginBottom: '20px',
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '12px',
    borderBottom: '1px solid #eee',
    paddingBottom: '8px',
  };

  const itemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  };

  const labelStyle = {
    color: '#444',
  };

  const valueStyle = {
    fontWeight: 'bold',
  };
  
  const buttonStyle = {
      display: 'block',
      width: '120px',
      margin: '32px auto 0',
      padding: '12px',
      border: 'none',
      borderRadius: '8px',
      backgroundColor: '#f0f0f0',
      cursor: 'pointer',
      textAlign: 'center',
      textDecoration: 'none',
      color: '#333',
      fontSize: '14px',
  };

  if (!scores || !scores.derived) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={headingStyle}>Thank you!</h1>
          <p style={subHeadingStyle}>Your responses were submitted successfully.</p>
          <p>There was an issue calculating your results.</p>
          <Link to="/" style={buttonStyle}>Back to start</Link>
        </div>
      </div>
    );
  }

  const { motivational_profile, stress_pattern, archetype } = scores.derived;

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>Thank you!</h1>
        <p style={subHeadingStyle}>Your responses are in. Here's your starting snapshot based on the Aria onboarding survey.</p>

        {motivational_profile && (
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Motivational profile</h2>
            <div style={itemStyle}>
              <span style={labelStyle}>Label:</span>
              <span style={valueStyle}>{motivational_profile.label}</span>
            </div>
            <div style={itemStyle}>
              <span style={labelStyle}>Confidence:</span>
              <span style={valueStyle}>{(motivational_profile.confidence * 100).toFixed(1)}%</span>
            </div>
          </div>
        )}

        {stress_pattern && (
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Stress pattern</h2>
            <div style={itemStyle}>
              <span style={labelStyle}>Label:</span>
              <span style={valueStyle}>{stress_pattern.label}</span>
            </div>
            <div style={itemStyle}>
              <span style={labelStyle}>Confidence:</span>
              <span style={valueStyle}>{(stress_pattern.confidence * 100).toFixed(1)}%</span>
            </div>
          </div>
        )}

        {archetype && archetype.primary && (
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Archetype stack ({archetype.group})</h2>
            <div style={itemStyle}>
              <span style={labelStyle}>Primary:</span>
              <span style={valueStyle}>{archetype.primary.label} ({(archetype.primary.weight * 100).toFixed(1)}%)</span>
            </div>
            <div style={itemStyle}>
              <span style={labelStyle}>Secondary:</span>
              <span style={valueStyle}>{archetype.secondary.label} ({(archetype.secondary.weight * 100).toFixed(1)}%)</span>
            </div>
            <div style={itemStyle}>
              <span style={labelStyle}>Tertiary:</span>
              <span style={valueStyle}>{archetype.tertiary.label} ({(archetype.tertiary.weight * 100).toFixed(1)}%)</span>
            </div>
          </div>
        )}
        
        <Link to="/" style={buttonStyle}>Back to start</Link>
      </div>
    </div>
  );
}
