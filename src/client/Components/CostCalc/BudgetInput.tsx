import { PropaneSharp } from '@mui/icons-material';
import React from 'react';
import { ACTIONS } from './CostBudget';

export default function BudgetInput(props) {
  function loadBudget(id: string, value: number) {
    console.log('this is  id', id);
    props.dispatch({
      type: ACTIONS.LOADBUDGET,
      payload: [id, value],
    });
  }
  return (
    <div className="verticalCenter">
      <br />
      <input
        id="cpu"
        className="inputField"
        onChange={(e) => {
          loadBudget(e.target.id, Number(e.target.value));
        }}
      ></input>
      <input
        id="gpu"
        className="inputField"
        onChange={(e) => {
          loadBudget(e.target.id, Number(e.target.value));
        }}
      ></input>
    </div>
  );
}
