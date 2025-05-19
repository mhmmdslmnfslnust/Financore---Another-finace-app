import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import TransactionService from '../../services/TransactionService';
import './Reports.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [transactionData, setTransactionData] = useState({
    categories: [],
    amounts: []
  });
  
  const [incomeVsExpenses, setIncomeVsExpenses] = useState({
    income: 0,
    expenses: 0
  });
  
  const [monthlyData, setMonthlyData] = useState({
    labels: [],
    income: [],
    expenses: []
  });
  
  const transactionService = new TransactionService();
  
  useEffect(() => {
    // Prepare category data for pie chart
    const categorySummary = transactionService.getCategorySummary();
    const expenseCategories = Object.entries(categorySummary)
      .filter(([_, data]) => data.type === 'expense');
    
    setTransactionData({
      categories: expenseCategories.map(([category]) => category),
      amounts: expenseCategories.map(([_, data]) => data.total)
    });
    
    // Get income vs expenses data
    setIncomeVsExpenses({
      income: transactionService.getTotalIncome(),
      expenses: transactionService.getTotalExpenses()
    });
    
    // Prepare monthly data
    prepareMonthlyData();
  }, []);
  
  const prepareMonthlyData = () => {
    const transactions = transactionService.getAllTransactions();
    const months = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!months[monthYear]) {
        months[monthYear] = { income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        months[monthYear].income += transaction.amount;
      } else {
        months[monthYear].expenses += transaction.amount;
      }
    });
    
    // Convert to arrays for chart
    const sortedMonths = Object.keys(months).sort((a, b) => {
      const [aMonth, aYear] = a.split('/').map(Number);
      const [bMonth, bYear] = b.split('/').map(Number);
      
      if (aYear !== bYear) return aYear - bYear;
      return aMonth - bMonth;
    });
    
    setMonthlyData({
      labels: sortedMonths,
      income: sortedMonths.map(month => months[month].income),
      expenses: sortedMonths.map(month => months[month].expenses)
    });
  };
  
  const getCategoryChartData = () => {
    return {
      labels: transactionData.categories,
      datasets: [
        {
          label: 'Spending by Category',
          data: transactionData.amounts,
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#8BC34A', '#607D8B', '#E91E63', '#3F51B5'
          ],
          borderWidth: 1
        }
      ]
    };
  };
  
  const getIncomeVsExpensesData = () => {
    return {
      labels: ['Income', 'Expenses'],
      datasets: [
        {
          label: 'Amount',
          data: [incomeVsExpenses.income, incomeVsExpenses.expenses],
          backgroundColor: ['#4CAF50', '#F44336'],
          borderWidth: 1
        }
      ]
    };
  };
  
  const getMonthlyTrendsData = () => {
    return {
      labels: monthlyData.labels,
      datasets: [
        {
          label: 'Income',
          data: monthlyData.income,
          fill: false,
          borderColor: '#4CAF50',
          tension: 0.1
        },
        {
          label: 'Expenses',
          data: monthlyData.expenses,
          fill: false,
          borderColor: '#F44336',
          tension: 0.1
        }
      ]
    };
  };
  
  return (
    <div className="reports-page">
      <h1>Financial Reports</h1>
      
      <div className="chart-container">
        <div className="chart-card">
          <h2>Spending by Category</h2>
          <div className="chart-wrapper">
            <Pie data={getCategoryChartData()} options={{ responsive: true }} />
          </div>
        </div>
        
        <div className="chart-card">
          <h2>Income vs. Expenses</h2>
          <div className="chart-wrapper">
            <Bar 
              data={getIncomeVsExpensesData()} 
              options={{ 
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }} 
            />
          </div>
        </div>
        
        <div className="chart-card full-width">
          <h2>Monthly Income and Expenses</h2>
          <div className="chart-wrapper">
            <Line 
              data={getMonthlyTrendsData()} 
              options={{ 
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
