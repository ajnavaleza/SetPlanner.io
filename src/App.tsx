import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateSetPlan from './pages/CreateSetPlan';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<CreateSetPlan />} />
      </Routes>
    </Router>
  );
}

export default App; 