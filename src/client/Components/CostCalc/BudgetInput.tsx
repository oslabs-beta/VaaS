import React from 'react';
import { ACTIONS } from './CostBudget';

export default function BudgetInput(props) {
  function loadBudget(id: string, value: number) {
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
        placeholder="$0"
        onChange={(e) => {
          loadBudget(e.target.id, Number(e.target.value));
        }}
      ></input>
      <input
        id="gpu"
        className="inputField"
        placeholder="$0"
        onChange={(e) => {
          loadBudget(e.target.id, Number(e.target.value));
        }}
      ></input>
      <input
        id="network"
        className="inputField"
        placeholder="$0"
        onChange={(e) => {
          loadBudget(e.target.id, Number(e.target.value));
        }}
      ></input>
      <input
        id="lb"
        className="inputField"
        placeholder="$0"
        onChange={(e) => {
          loadBudget(e.target.id, Number(e.target.value));
        }}
      ></input>
      <input
        id="pv"
        className="inputField"
        placeholder="$0"
        onChange={(e) => {
          loadBudget(e.target.id, Number(e.target.value));
        }}
      ></input>
      <input
        id="ram"
        className="inputField"
        placeholder="$0"
        onChange={(e) => {
          loadBudget(e.target.id, Number(e.target.value));
        }}
      ></input>
      <input
        id="shared"
        className="inputField"
        placeholder="$0"
        onChange={(e) => {
          loadBudget(e.target.id, Number(e.target.value));
        }}
      ></input>
      <input
        id="external"
        className="inputField"
        placeholder="$0"
        onChange={(e) => {
          loadBudget(e.target.id, Number(e.target.value));
        }}
      ></input>
      <span className="bold topBorder">
        ${props.budget.total[0] ? props.budget.total[0] : 0}
      </span>
    </div>
  );
}
