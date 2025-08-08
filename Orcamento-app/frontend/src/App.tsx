import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import CalculatorPage from './pages/CalculatorPage';
import AdminPage from './pages/AdminPage';
import DashboardPage from './pages/DashboardPage';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
                             <Route 
                 path="/admin" 
                 element={
                   <ProtectedRoute>
                     <DashboardPage />
                   </ProtectedRoute>
                 } 
               />
               <Route 
                 path="/admin/settings" 
                 element={
                   <ProtectedRoute>
                     <AdminPage />
                   </ProtectedRoute>
                 } 
               />
            </Routes>
          </main>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 