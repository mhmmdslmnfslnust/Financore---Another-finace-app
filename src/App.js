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

// Import patterns
import DatabaseService from './patterns/singleton/DatabaseService';
import { BudgetingState } from './patterns/state/FinancialState';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Initialize the application with a default state
  useEffect(() => {
    const defaultState = new BudgetingState();
    DatabaseService.setFinancialState(defaultState);
  }, []);

  return (
    <Router>
      <div className="app">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="main-container">
          <Sidebar isOpen={sidebarOpen} />
          <div className={`content ${sidebarOpen ? 'content-with-sidebar' : ''}`}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
