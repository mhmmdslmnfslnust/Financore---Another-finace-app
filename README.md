# FinanCore - Personal Finance Management System

## Overview
FinanCore is a comprehensive personal finance management system that helps users track their income, expenses, investments, and savings goals. The application provides features to categorize transactions, generate financial reports, and offer AI-powered recommendations to optimize spending, save more money, and make smarter investment decisions.

## Features

### Transaction Management
- Add, edit, and delete financial transactions
- Automatic categorization of transactions
- Filter and search transactions

### Goal Tracking
- Set financial goals with target amounts and deadlines
- Track progress toward goals 
- Contribute to goals over time

### Budget Management
- Multiple budgeting strategies (Zero-based, 50/30/20 rule)
- Budget vs. actual spending analysis
- Category-based spending limits

### Financial State Management
- Switch between different financial modes (Budgeting, Savings, Investment)
- Get mode-specific recommendations and dashboard views

### AI-Powered Recommendations
- Spending optimization suggestions
- Savings rate recommendations
- Investment allocation advice

### Financial Reporting
- Interactive charts and graphs
- Income vs. expenses analysis
- Category-based spending breakdown
- Monthly financial trends

## Technologies Used

- **Frontend**: React.js
- **State Management**: React Hooks
- **Routing**: React Router
- **Data Visualization**: Chart.js with React-Chartjs-2
- **Styling**: CSS with component-based architecture
- **Design Patterns**: Singleton, Strategy, Composite, State patterns

## Installation and Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-username/financore.git
   cd financore
   ```

2. Environment Setup:
   - Create a `.env` file in the server directory using `.env.example` as a template
   - Update the credentials in your `.env` file
   - Never commit your actual `.env` file to version control
   ```
   # Example .env setup
   cp server/.env.example server/.env
   # Then edit server/.env with your actual credentials
   ```

3. Install dependencies:
   ```
   npm install
   cd server && npm install
   ```

4. Start the development server:
   ```
   # In one terminal
   npm start
   
   # In another terminal
   cd server && npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Usage Guide

### Dashboard
The dashboard provides an overview of your financial situation, including:
- Income and expense summary
- Recent transactions
- Goal progress
- Top AI recommendations

### Transactions
- Click "Add Transaction" to record new income or expenses
- Use filters to view specific transaction types or search for specific entries
- Edit or delete transactions as needed

### Goals
- Create financial goals with target amounts and deadlines
- Track progress with visual progress bars
- Contribute to goals incrementally

### Recommendations
View AI-generated recommendations based on your financial data, categorized into:
- Spending optimization
- Savings opportunities
- Investment advice

### Reports
View interactive charts that visualize:
- Spending by category
- Income vs. expenses
- Monthly financial trends

## Project Structure

```
src/
├── components/         # React components
│   ├── Dashboard/      # Dashboard components
│   ├── Goals/          # Financial goals components
│   ├── Reports/        # Financial reporting components
│   ├── Transactions/   # Transaction management components
│   ├── Recommendations/# Recommendation components
│   └── UI/             # Common UI components
├── models/             # Data models
├── patterns/           # Design pattern implementations
│   ├── composite/      # Composite pattern
│   ├── singleton/      # Singleton pattern
│   ├── state/          # State pattern
│   └── strategy/       # Strategy pattern
├── services/           # Business logic services
└── App.js              # Main application component
```

## Design Principles

This application is built following SOLID principles and uses various design patterns to ensure maintainability, extensibility, and flexibility. For more details on the design and architecture, see the [DESIGN.md](./DESIGN.md) file.
