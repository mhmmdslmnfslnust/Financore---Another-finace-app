import DatabaseService from '../patterns/singleton/DatabaseService';
import Goal from '../models/Goal';

export default class GoalService {
  getAllGoals() {
    return DatabaseService.getGoals();
  }

  getGoalById(id) {
    return DatabaseService.getGoals().find(goal => goal.id === id);
  }

  addGoal(goalData) {
    const goal = new Goal(goalData);
    return DatabaseService.saveGoal(goal);
  }

  updateGoal(id, goalData) {
    const existingGoal = this.getGoalById(id);
    if (!existingGoal) {
      throw new Error(`Goal with ID ${id} not found`);
    }

    const updatedGoal = { ...existingGoal, ...goalData, id };
    return DatabaseService.saveGoal(updatedGoal);
  }

  deleteGoal(id) {
    return DatabaseService.deleteGoal(id);
  }

  contributeToGoal(id, amount) {
    const goal = this.getGoalById(id);
    if (!goal) {
      throw new Error(`Goal with ID ${id} not found`);
    }

    goal.contribute(amount);
    return DatabaseService.saveGoal(goal);
  }

  getCompletedGoals() {
    return DatabaseService.getGoals().filter(goal => goal.currentAmount >= goal.targetAmount);
  }

  getIncompleteGoals() {
    return DatabaseService.getGoals().filter(goal => goal.currentAmount < goal.targetAmount);
  }

  getGoalProgress(id) {
    const goal = this.getGoalById(id);
    if (!goal) {
      throw new Error(`Goal with ID ${id} not found`);
    }

    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    return Math.min(progress, 100); // Cap at 100%
  }

  // Calculate monthly contribution needed to reach the goal by deadline
  calculateRequiredMonthlyContribution(id) {
    const goal = this.getGoalById(id);
    if (!goal) {
      throw new Error(`Goal with ID ${id} not found`);
    }

    if (!goal.deadline) {
      return null; // No deadline set
    }

    const today = new Date();
    const deadline = new Date(goal.deadline);
    
    if (deadline <= today) {
      return null; // Deadline is in the past
    }

    const remainingAmount = goal.targetAmount - goal.currentAmount;
    const monthsRemaining = (deadline.getFullYear() - today.getFullYear()) * 12 + 
                           (deadline.getMonth() - today.getMonth());
    
    if (monthsRemaining <= 0) {
      return remainingAmount; // Due this month
    }

    return remainingAmount / monthsRemaining;
  }
}
