import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MovieProvider } from './contexts/MovieContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { MovieDetailsPage } from './pages/MovieDetailsPage';

function App() {
  return (
    <AuthProvider>
      <MovieProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-background-dark text-white">
            <Navbar />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/movie/:id" element={<MovieDetailsPage />} />
                <Route path="*" element={<Navigate to="/\" replace />} />
              </Routes>
            </div>
          </div>
        </Router>
      </MovieProvider>
    </AuthProvider>
  );
}

export default App;