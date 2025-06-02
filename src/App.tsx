import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CreateSetPlan from './pages/CreateSetPlan';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<CreateSetPlan />} />
      </Routes>
    </Router>
  );
};

export default App; 