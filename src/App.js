import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateSetPlan from './pages/CreateSetPlan';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateSetPlan />} />
      </Routes>
    </Router>
  );
}

export default App;
