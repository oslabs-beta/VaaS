import { NewReleasesOutlined } from '@mui/icons-material';
import load from 'postcss-load-config';
import React, { useReducer } from 'react';
import BudgetInput from './BudgetInput';
import './costStyle.css';
import InfoBox from './InfoBox';
import MonthContainer from './MonthContainer';
import RowTotal from './RowTotal';
import SideLabel from './SideLabel';

export const ACTIONS = {
  LOADBUDGET: 'load_budget',
  CHANGEMULTI: 'change_multi',
};

function reducer(budget, action) {
  switch (action.type) {
    case ACTIONS.LOADBUDGET: {
      const newBudget = { ...budget };
      for (let i = 0; i <= 11; i++) {
        newBudget.tag.push(i);
        newBudget[action.payload[0]].push(
          action.payload[1] * newBudget.multi[i]
        );
      }
      return newBudget;
    }
    case ACTIONS.CHANGEMULTI: {
      break;
    }
    case 'default':
      return budget;
  }
}

export default function CostBudget() {
  const [budget, dispatch] = useReducer(reducer, {
    multi: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    tag: [],
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
      budgetInfoArr.push(<SideLabel key={i} />);
      continue;
    }
    if (i === 2) {
      budgetInfoArr.push(<BudgetInput dispatch={dispatch} />);
      continue;
    }
    if (i === 14) budgetInfoArr.push(<RowTotal key={i} budget={budget} />);
    else {
      budgetInfoArr.push(
        <InfoBox
          key={i}
          tag={budget.tag[i - 1]}
          cpu={budget.cpu[i - 1]}
          gpu={budget.gpu[i - 1]}
          network={budget.network[i - 1]}
          lb={budget.lb[i - 1]}
          pv={budget.pv[i - 1]}
          ram={budget.ram[i - 1]}
          shared={budget.shared[i - 1]}
          external={budget.external[i - 1]}
          total={budget.total[i - 1]}
          reducer={reducer}
        />
      );
    }
  }
  return (
    <div className="actualDisplay">
      <h2>Monthly Budget</h2>
      <MonthContainer />
      <div className="xivContainers">{budgetInfoArr}</div>
    </div>
  );
}
