import React from 'react';
import Chart from 'chart.js/auto';
import CostActual from './CostActual';
import CostBudget from './CostBudget';
import './costStyle.css';

export default function CostMain() {
  return (
    <div className="costContainer">
      <canvas className="chartArea" id="costChart"></canvas>
      <CostActual />
      <CostBudget />
    </div>
  );
}
