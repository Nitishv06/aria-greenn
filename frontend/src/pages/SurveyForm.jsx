import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import surveyData from '../data/survey.js';
import { calculateScores } from '../lib/scoring';

// Helper function to shuffle an array
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const SurveyForm = () => {
  // Component state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [shuffledChoiceKeys, setShuffledChoiceKeys] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { questions } = surveyData;
  const currentQuestion = questions[currentQuestionIndex];
  
  // Effect to shuffle choices when the question changes
  useEffect(() => {
    if (currentQuestion) {
      const choiceKeys = Object.keys(currentQuestion.choices);
      setShuffledChoiceKeys(shuffleArray(choiceKeys));
    }
  }, [currentQuestion]);

  // Handle selecting an answer
  const handleAnswerSelect = (choiceKey) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: choiceKey }));
  };
  
  // Handle form submission on the final question
  const handleSubmit = () => {
    if (isSubmitting) return; 
    setIsSubmitting(true);
    
    try {
      const scores = calculateScores(answers, surveyData);
      navigate('/thank-you', { state: { scores } });
    
    } catch (error) {
      console.error("Error during survey submission:", error);
      alert("A critical error occurred while submitting. Please check the console.");
      setIsSubmitting(false);
    }
  };

  // Navigate to the next question or submit
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  // Navigate to the previous question
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Navigate to a specific question via progress dots
  const handleDotClick = (index) => {
    setCurrentQuestionIndex(index);
  };
  
  if (!currentQuestion) {
    return <div>Loading survey questions...</div>;
  }

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="survey-shell">
      <div className="survey-header">
        <h1>Aria Onboarding Survey</h1>
        <p>Help us personalize your experience.</p>
      </div>

      <div className="progress-container">
        <div className="progress-dots">
          {questions.map((q, index) => (
            <button
              key={q.id}
              className={`progress-dot ${currentQuestionIndex === index ? 'active' : ''} ${answers.hasOwnProperty(q.id) ? 'visited' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to question ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="survey-question-container">
        <div className="survey-step">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="survey-question">
          <h2>{currentQuestion.text}</h2>
        </div>
        
        <div className="survey-options">
          {shuffledChoiceKeys.map((key) => {
            const choice = currentQuestion.choices[key];
            const label = typeof choice === 'object' ? choice.label : choice;
            return (
              <button
                key={key}
                className={`survey-option ${answers[currentQuestion.id] === key ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(key)}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="survey-nav">
        <button 
          className="nav-button secondary"
          onClick={handleBack} 
          disabled={currentQuestionIndex === 0 || isSubmitting}
        >
          Back
        </button>
        <button 
          className="nav-button primary"
          onClick={handleNext}
          disabled={!answers[currentQuestion.id] || isSubmitting}
        >
          {isSubmitting ? 'Finishing...' : (isLastQuestion ? 'Finish' : 'Next')}
        </button>
      </div>
    </div>
  );
};

export default SurveyForm;
