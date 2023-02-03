import { display } from '@mui/system';
import React from 'react';
import './costStyle.css';

export default function MonthContainer() {
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
  const displayArr = [];
  const currentMonth: number = new Date().getMonth();
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

  return <div className="xivContainers monthBorder">{displayArr}</div>;
}
