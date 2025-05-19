import DatabaseService from '../patterns/singleton/DatabaseService';
import Transaction from '../models/Transaction';

export default class TransactionService {
  getAllTransactions() {
    return DatabaseService.getTransactions();
  }

  getTransactionById(id) {
    return DatabaseService.getTransactions().find(transaction => transaction.id === id);
  }

  addTransaction(transactionData) {
    const transaction = new Transaction(transactionData);
    return DatabaseService.saveTransaction(transaction);
  }

  updateTransaction(id, transactionData) {
    const existingTransaction = this.getTransactionById(id);
    if (!existingTransaction) {
      throw new Error(`Transaction with ID ${id} not found`);
    }

    const updatedTransaction = { ...existingTransaction, ...transactionData, id };
    return DatabaseService.saveTransaction(updatedTransaction);
  }

  deleteTransaction(id) {
    return DatabaseService.deleteTransaction(id);
  }

  getTransactionsByType(type) {
    return DatabaseService.getTransactions().filter(transaction => transaction.type === type);
  }

  getTransactionsByCategory(category) {
    return DatabaseService.getTransactions().filter(transaction => transaction.category === category);
  }

  getTransactionsByDateRange(startDate, endDate) {
    return DatabaseService.getTransactions().filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
    });
  }

  getTotalIncome() {
    return this.getTransactionsByType('income').reduce((sum, transaction) => sum + transaction.amount, 0);
  }

  getTotalExpenses() {
    return this.getTransactionsByType('expense').reduce((sum, transaction) => sum + transaction.amount, 0);
  }

  getNetIncome() {
    return this.getTotalIncome() - this.getTotalExpenses();
  }

  getCategorySummary() {
    const transactions = DatabaseService.getTransactions();
    
    return transactions.reduce((summary, transaction) => {
      if (!summary[transaction.category]) {
        summary[transaction.category] = {
          total: 0,
          count: 0,
          type: transaction.type
        };
      }
      
      summary[transaction.category].total += transaction.amount;
      summary[transaction.category].count += 1;
      
      return summary;
    }, {});
  }

  // Simple AI categorization based on transaction description
  predictCategory(description, type) {
    description = description.toLowerCase();
    
    const categoryKeywords = {
      'salary': 'Salary',
      'paycheck': 'Salary',
      'deposit': 'Income',
      'rent': 'Housing',
      'mortgage': 'Housing',
      'grocery': 'Food',
      'restaurant': 'Dining',
      'uber': 'Transportation',
      'gas': 'Transportation',
      'netflix': 'Entertainment',
      'spotify': 'Entertainment',
      'doctor': 'Healthcare',
      'pharmacy': 'Healthcare',
      'insurance': 'Insurance',
    };
    
    for (const [keyword, category] of Object.entries(categoryKeywords)) {
      if (description.includes(keyword)) {
        return category;
      }
    }
    
    return type === 'income' ? 'Other Income' : 'Miscellaneous';
  }
}
