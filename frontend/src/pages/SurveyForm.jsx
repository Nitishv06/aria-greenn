import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import questions from '../data/questions.js';

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const SurveyForm = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [isCompleting, setIsCompleting] = useState(false);
  const navigate = useNavigate();

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (currentQuestion) {
      setShuffledOptions(shuffleArray(currentQuestion.options));
    }
  }, [currentQuestion]);

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

  const handleDotClick = (index) => {
    setCurrentQuestionIndex(index);
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
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="survey-shell">
      <div className="survey-header">
        <h1>Customer Feedback</h1>
        <p>Help us improve by answering a few questions.</p>
      </div>

      <div className="progress-container">
        <div className="progress-dots">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`progress-dot ${currentQuestionIndex === index ? 'active' : ''} ${answers.hasOwnProperty(index) ? 'visited' : ''}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
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
          {shuffledOptions.map((option, index) => (
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
