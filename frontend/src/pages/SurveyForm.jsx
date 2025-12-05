import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import questions from '../data/questions';

const SurveyForm = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleting, setIsCompleting] = useState(false);
  const navigate = useNavigate();

  const handleAnswer = (option) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: option }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsCompleting(true);
    try {
      const response = await fetch('http://localhost:5000/submit-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      if (response.ok) {
        navigate('/thank-you');
      } else {
        console.error('Survey submission failed');
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="survey-shell">
      <div className="survey-header">
        <h1>Customer Feedback</h1>
        <p>Help us improve by answering a few questions.</p>
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="survey-question-container">
        <div className="survey-step">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="survey-question">
          <h2>{currentQuestion.question}</h2>
          {currentQuestion.helperText && <p className="helper-text">{currentQuestion.helperText}</p>}
        </div>

        <div className="survey-options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`survey-option ${answers[currentQuestionIndex] === option ? 'selected' : ''}`}
              onClick={() => handleAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="survey-nav">
        <button 
          className="nav-button secondary"
          onClick={handleBack} 
          disabled={currentQuestionIndex === 0}
        >
          Back
        </button>
        <button 
          className="nav-button primary"
          onClick={handleNext}
          disabled={!answers[currentQuestionIndex] || isCompleting}
        >
          {isCompleting ? 'Submitting...' : (currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next')}
        </button>
      </div>
    </div>
  );
};

export default SurveyForm;
