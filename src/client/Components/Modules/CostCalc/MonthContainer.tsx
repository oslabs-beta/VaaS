import { display } from '@mui/system';
import React from 'react';
import { displayPartsToString } from 'typescript';
import './costStyle.css';

export default function MonthContainer(props) {
  return <div className="xivContainers monthBorder">{props.month}</div>;
}
