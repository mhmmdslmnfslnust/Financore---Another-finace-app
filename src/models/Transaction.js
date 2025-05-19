import { v4 as uuidv4 } from 'uuid';

export default class Transaction {
  constructor({
    id = uuidv4(),
    date = new Date().toISOString().split('T')[0],
    description = '',
    amount = 0,
    type = 'expense',
    category = 'Uncategorized',
    accountId = null
  } = {}) {
    this.id = id;
    this.date = date;
    this.description = description;
    this.amount = amount;
    this.type = type; // 'income' or 'expense'
    this.category = category;
    this.accountId = accountId;
  }
}

// Common transaction categories
export const EXPENSE_CATEGORIES = [
  'Housing',
  'Transportation',
  'Food',
  'Utilities',
  'Insurance',
  'Healthcare',
  'Debt',
  'Personal',
  'Entertainment',
  'Dining',
  'Education',
  'Shopping',
  'Gifts',
  'Travel',
  'Miscellaneous'
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Business',
  'Investments',
  'Side Hustle',
  'Gifts',
  'Other'
];
