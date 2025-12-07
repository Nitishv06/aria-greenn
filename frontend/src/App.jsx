import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SurveyForm from './pages/SurveyForm';
import ThankYou from './pages/ThankYou';

function App() {
  return (
    <Router>
      <div className="survey-root">
        <h1 className="main-heading">Aria Insights</h1>
        <Routes>
          <Route path="/" element={<SurveyForm />} />
          <Route path="/thank-you" element={<ThankYou />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
