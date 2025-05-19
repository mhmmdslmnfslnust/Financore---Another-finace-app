import React from 'react';
import { BudgetingState, SavingsState, InvestmentState } from '../../patterns/state/FinancialState';
import './ModeSelector.css';

const ModeSelector = ({ currentState, onStateChange }) => {
  const states = [
    new BudgetingState(),
    new SavingsState(),
    new InvestmentState()
  ];

  return (
    <div className="mode-selector">
      <div className="mode-selector-label">Financial Mode:</div>
      <div className="mode-options">
        {states.map(state => (
          <button
            key={state.getName()}
            className={`mode-option ${currentState && currentState.getName() === state.getName() ? 'active' : ''}`}
            onClick={() => onStateChange(state)}
            title={state.getDescription()}
          >
            {state.getName()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModeSelector;
