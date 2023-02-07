import React, { useReducer } from 'react';
import BudgetInput from './BudgetInput';
import InfoBox from './InfoBox';
import MonthContainer from './MonthContainer';
import RowTotal from './RowTotal';
import SideLabel from './SideLabel';
import CostGraph from './CostGraph';

export const ACTIONS = {
  LOADBUDGET: 'load_budget',
  CHANGEMULTI: 'change_multi',
};

function reducer(budget: any, action: any) {
  switch (action.type) {
    case ACTIONS.LOADBUDGET: {
      const newBudget = { ...budget };
      for (let i = 0; i <= 11; i++) {
        newBudget[action.payload[0]][i] =
          action.payload[1] * newBudget.multi[i];
        const cpu = newBudget.cpu[i] ? newBudget.cpu[i] : 0;
        const gpu = newBudget.gpu[i] ? newBudget.gpu[i] : 0;
        const network = newBudget.network[i] ? newBudget.network[i] : 0;
        const lb = newBudget.lb[i] ? newBudget.lb[i] : 0;
        const pv = newBudget.pv[i] ? newBudget.pv[i] : 0;
        const ram = newBudget.ram[i] ? newBudget.ram[i] : 0;
        const shared = newBudget.shared[i] ? newBudget.shared[i] : 0;
        const external = newBudget.external[i] ? newBudget.external[i] : 0;
        const colTotal =
          cpu + gpu + network + lb + pv + ram + shared + external;
        newBudget.total[i] = colTotal;
      }
      return newBudget;
    }
    case ACTIONS.CHANGEMULTI: {
      const newBudget = { ...budget };
      newBudget.multi[action.payload[0]] = action.payload[1];
      newBudget.cpu[action.payload[0]] = Math.round(
        newBudget.cpu[0] * action.payload[1]
      );
      newBudget.gpu[action.payload[0]] = Math.round(
        newBudget.gpu[0] * action.payload[1]
      );
      newBudget.network[action.payload[0]] = Math.round(
        newBudget.network[0] * action.payload[1]
      );
      newBudget.lb[action.payload[0]] = Math.round(
        newBudget.lb[0] * action.payload[1]
      );
      newBudget.pv[action.payload[0]] = Math.round(
        newBudget.pv[0] * action.payload[1]
      );
      newBudget.ram[action.payload[0]] = Math.round(
        newBudget.ram[0] * action.payload[1]
      );
      newBudget.shared[action.payload[0]] = Math.round(
        newBudget.shared[0] * action.payload[1]
      );
      newBudget.external[action.payload[0]] = Math.round(
        newBudget.external[0] * action.payload[1]
      );
      newBudget.total[action.payload[0]] = Math.round(
        newBudget.total[0] * action.payload[1]
      );
      return newBudget;
    }
    case 'default':
      return budget;
  }
}

export default function CostBudget(props: any) {
  const [budget, dispatch] = useReducer(reducer, {
    multi: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    tag: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    cpu: [],
    gpu: [],
    network: [],
    lb: [],
    pv: [],
    ram: [],
    shared: [],
    external: [],
    total: [],
  });

  const budgetInfoArr = [];
  for (let i = 1; i <= 14; i++) {
    if (i === 1) {
      budgetInfoArr.push(<SideLabel key={`budget${i}`} />);
      continue;
    }
    if (i === 2) {
      budgetInfoArr.push(
        <BudgetInput key={`budget${i}`} budget={budget} dispatch={dispatch} />
      );
      continue;
    }
    if (i === 14)
      budgetInfoArr.push(<RowTotal key={`budget${i}`} budget={budget} />);
    else {
      budgetInfoArr.push(
        <InfoBox
          key={`budget${i}`}
          tag={budget.tag[i - 2]}
          cpu={budget.cpu[i - 2]}
          gpu={budget.gpu[i - 2]}
          network={budget.network[i - 2]}
          lb={budget.lb[i - 2]}
          pv={budget.pv[i - 2]}
          ram={budget.ram[i - 2]}
          shared={budget.shared[i - 2]}
          external={budget.external[i - 2]}
          total={budget.total[i - 2]}
          dispatch={dispatch}
        />
      );
    }
  }
  return (
    <div className="actualDisplay">
      <h2 className="bold">Monthly Budget ***BETA***</h2>
      <div className="costGraph">
        <div className="subGraph">
          <CostGraph budget={budget} monthArr={props.monthArr} />
        </div>
      </div>
      <MonthContainer key={'budgetMonth'} month={props.month} />
      <div className="xivContainers costBorder">{budgetInfoArr}</div>
      <button className="costButton">Save budget settings</button>
    </div>
  );
}
