import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import PumpsPage from './pages/pumpsPage'
import PumpDetail from './pages/pumpDetail';

const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

export default function App() {
  if (!isAuthenticated() && window.location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/pumps" element={<PumpsPage />} />
        <Route path="/pumps/:id" element={<PumpDetail />} />
      </Routes>
  );
}
