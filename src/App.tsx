import { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';

// Page components
import LandingPage from './pages/LandingPage';
import CreateSetPlan from './pages/CreateSetPlan';
import CrowdVoting from './pages/CrowdVoting';
import DJLogin from './pages/DJLogin';
import DJControlPanel from './components/DJControlPanel';

// Route configuration
const routes = [
  { path: '/', element: <LandingPage /> },
  { path: '/create', element: <CreateSetPlan /> },
  { path: '/crowd-voting', element: <CrowdVoting /> },
  { path: '/dj-login', element: <DJLogin /> },
  { 
    path: '/dj-control',
    element: (
      <ProtectedRoute>
        <DJControlPanel />
      </ProtectedRoute>
    )
  }
] as const;

const App: FC = () => (
  <Router>
    <AuthProvider>
      <SocketProvider>
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </SocketProvider>
    </AuthProvider>
  </Router>
);

export default App; 