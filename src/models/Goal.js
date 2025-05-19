import { v4 as uuidv4 } from 'uuid';

export default class Goal {
  constructor({
    id = uuidv4(),
    name = '',
    targetAmount = 0,
    currentAmount = 0,
    deadline = null,
    category = 'Savings'
  } = {}) {
    this.id = id;
    this.name = name;
    this.targetAmount = targetAmount;
    this.currentAmount = currentAmount;
    this.deadline = deadline;
    this.category = category;
  }

  getProgress() {
    return this.currentAmount / this.targetAmount;
  }

  getProgressPercentage() {
    return this.getProgress() * 100;
  }

  getRemainingAmount() {
    return this.targetAmount - this.currentAmount;
  }

  isCompleted() {
    return this.currentAmount >= this.targetAmount;
  }

  contribute(amount) {
    this.currentAmount += amount;
  }
}
