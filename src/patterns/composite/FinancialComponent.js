/**
 * Composite pattern for managing financial accounts
 */
export class FinancialComponent {
  constructor(name) {
    this.name = name;
  }

  getBalance() {
    throw new Error("Method getBalance() must be implemented");
  }

  addTransaction(amount) {
    throw new Error("Method addTransaction() must be implemented");
  }
}

export class Account extends FinancialComponent {
  constructor(id, name, type, balance = 0) {
    super(name);
    this.id = id;
    this.type = type;
    this.balance = balance;
    this.transactions = [];
  }

  getBalance() {
    return this.balance;
  }

  addTransaction(amount, description, date, category) {
    this.balance += amount;
    const transaction = {
      id: Date.now().toString(),
      amount,
      description,
      date: date || new Date().toISOString().split('T')[0],
      category: category || 'Uncategorized',
      accountId: this.id
    };
    
    this.transactions.push(transaction);
    return transaction;
  }

  getTransactions() {
    return [...this.transactions];
  }
}

export class AccountGroup extends FinancialComponent {
  constructor(name) {
    super(name);
    this.accounts = [];
  }

  add(account) {
    this.accounts.push(account);
  }

  remove(account) {
    const index = this.accounts.indexOf(account);
    if (index >= 0) {
      this.accounts.splice(index, 1);
    }
  }

  getBalance() {
    return this.accounts.reduce((total, account) => {
      return total + account.getBalance();
    }, 0);
  }

  addTransaction(amount) {
    throw new Error("Cannot add transaction directly to an account group");
  }

  getChildAccounts() {
    return [...this.accounts];
  }
}
