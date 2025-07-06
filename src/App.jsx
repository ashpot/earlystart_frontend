import React from 'react';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import { useContext } from 'react';
// import { AuthContext, AuthProvider } from './contexts/AuthContext';
import Index from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import './css/styles.css'

// Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const { user } = useContext(AuthContext);
//   return user ? children : <Navigate to="/login" />;
// };

function App() {

  return (
    // <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              // <ProtectedRoute>
                <DashboardPage />
              // </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    // </AuthProvider>
  )
}

export default App
