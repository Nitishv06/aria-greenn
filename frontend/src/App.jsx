import React from "react";
import { Routes, Route } from "react-router-dom";
import SurveyForm from "./pages/SurveyForm";
import ThankYou from "./pages/ThankYou";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SurveyForm />} />
      <Route path="/thanks" element={<ThankYou />} />
    </Routes>
  );
}
