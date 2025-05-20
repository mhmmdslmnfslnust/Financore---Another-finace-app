import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Transactions from './components/Transactions/Transactions';
import Goals from './components/Goals/Goals';
import Recommendations from './components/Recommendations/Recommendations';
import Reports from './components/Reports/Reports';
import Navbar from './components/UI/Navbar';
import Sidebar from './components/UI/Sidebar';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Initialize the application with a default state
  // useEffect(() => {
  //   const defaultState = new BudgetingState();
  //   DatabaseService.setFinancialState(defaultState);
  // }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <div className="main-container">
            <Sidebar isOpen={sidebarOpen} />
            <div className={`content ${sidebarOpen ? 'content-with-sidebar' : ''}`}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/transactions" 
                  element={
                    <ProtectedRoute>
                      <Transactions />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/goals" 
                  element={
                    <ProtectedRoute>
                      <Goals />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/recommendations" 
                  element={
                    <ProtectedRoute>
                      <Recommendations />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reports" 
                  element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
