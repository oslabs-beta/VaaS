import React from 'react';
import CostActual from './CostActual';
import CostBudget from './CostBudget';
import './costStyle.css';

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

  const currentMonth: number = new Date().getMonth();
  let monthCount = 1;
  const monthArr = [];
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
      <CostActual month={displayArr} monthArr={monthArr} />
      <CostBudget month={displayArr} monthArr={monthArr} />
    </div>
  );
}
