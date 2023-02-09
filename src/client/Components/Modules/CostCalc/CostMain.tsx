import React from 'react';
import CostActual from './CostActual';
import CostBudget from './CostBudget';
import './costStyle.css';
import { useLocation } from 'react-router-dom';

export default function CostMain() {
  const month = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];

  const { state } = useLocation();
  const currentMonth: number = new Date().getMonth();

  const monthArr = [];
  let monthCount = 1;
  for (let i = currentMonth; monthCount <= 12; i++) {
    if (i > 11) i = 0;
    monthArr.push(month[i]);
    monthCount++;
  }

  const displayArr = [];
  let count = 1;
  for (let i = currentMonth; count <= 13; count++) {
    if (count === 1) displayArr.push(<div></div>);
    if (i > 11) i = 0;
    if (count === 13) displayArr.push(<div className="center">Total</div>);
    else {
      displayArr.push(<div className="center">{month[i]}</div>);
      i++;
    }
  }

  return (
    <div className="costContainer">
      <div id="kubacus-title">KUBACUS: {state[0].name}</div>
      <CostActual month={displayArr} monthArr={monthArr} />
      <CostBudget month={displayArr} monthArr={monthArr} />
    </div>
  );
}
