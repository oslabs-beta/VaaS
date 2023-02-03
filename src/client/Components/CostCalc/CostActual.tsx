import React, { useState, useEffect, useReducer } from 'react';
import './costStyle.css';
import InfoBox from './InfoBox';
import MonthContainer from './MonthContainer';
import RowTotal from './RowTotal';
import SideLabel from './SideLabel';

export const ACTIONS = {
  LOADDATA: 'load_data',
  CHANGEMULTI: 'change_multi',
};

function reducer(load, action) {
  switch (action.type) {
    case ACTIONS.LOADDATA: {
      const newLoad = { ...load };
      for (let i = 0; i <= 11; i++) {
        const colTotal =
          action.payload[0] * load.multi[i] +
          action.payload[1] * load.multi[i] +
          action.payload[2] * load.multi[i] +
          action.payload[3] * load.multi[i] +
          action.payload[4] * load.multi[i] +
          action.payload[5] * load.multi[i] +
          action.payload[6] * load.multi[i] +
          action.payload[7] * load.multi[i];
        newLoad.tag.push(i);
        newLoad.cpu.push(action.payload[0] * load.multi[i]);
        newLoad.gpu.push(action.payload[1] * load.multi[i]);
        newLoad.network.push(action.payload[2] * load.multi[i]);
        newLoad.lb.push(action.payload[3] * load.multi[i]);
        newLoad.pv.push(action.payload[4] * load.multi[i]);
        newLoad.ram.push(action.payload[5] * load.multi[i]);
        newLoad.shared.push(action.payload[6] * load.multi[i]);
        newLoad.external.push(action.payload[7] * load.multi[i]);
        newLoad.total.push(colTotal);
      }
      return newLoad;
    }
    case ACTIONS.CHANGEMULTI: {
      const newLoad = { ...load };
      newLoad.multi[action.payload[0]] = action.payload[1];
      newLoad.cpu[action.payload[0]] = Math.round(
        newLoad.cpu[0] * action.payload[1]
      );
      newLoad.gpu[action.payload[0]] = Math.round(
        newLoad.gpu[0] * action.payload[1]
      );
      newLoad.network[action.payload[0]] = Math.round(
        newLoad.network[0] * action.payload[1]
      );
      newLoad.lb[action.payload[0]] = Math.round(
        newLoad.lb[0] * action.payload[1]
      );
      newLoad.pv[action.payload[0]] = Math.round(
        newLoad.pv[0] * action.payload[1]
      );
      newLoad.ram[action.payload[0]] = Math.round(
        newLoad.ram[0] * action.payload[1]
      );
      newLoad.shared[action.payload[0]] = Math.round(
        newLoad.shared[0] * action.payload[1]
      );
      newLoad.external[action.payload[0]] = Math.round(
        newLoad.external[0] * action.payload[1]
      );
      newLoad.total[action.payload[0]] = Math.round(
        newLoad.total[0] * action.payload[1]
      );
      return newLoad;
    }
    case 'default':
      return load;
  }
}

export default function CostActual() {
  const [data, setData] = useState([]);
  const [load, dispatch] = useReducer(reducer, {
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

  const fetchData = async () => {
    const response = await fetch(
      'http://34.171.214.61:9090/model/allocation?window=30d&aggregate=cluster&accumulate=false&shareIdle=false'
    );
    const parsed = await response.json();
    setData(parsed.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const cpuCostArr: number[] = [];
  const gpuCostArr: number[] = [];
  const networkCostArr: number[] = [];
  const loadBalancerCostArr: number[] = [];
  const pvCostArr: number[] = [];
  const ramCostArr: number[] = [];
  const sharedCostArr: number[] = [];
  const externalCostArr: number[] = [];

  data.forEach((element) => {
    if (element) {
      if (Object.keys(element).length !== 0) {
        const cpuCost =
          element['__idle__']['cpuCost'] + element['cluster-one']['cpuCost'];
        cpuCostArr.push(cpuCost);
        const gpuCost =
          element['__idle__']['gpuCost'] + element['cluster-one']['gpuCost'];
        gpuCostArr.push(gpuCost);
        const networkCost =
          element['__idle__']['networkCost'] +
          element['cluster-one']['networkCost'];
        networkCostArr.push(networkCost);
        const loadBalancerCost =
          element['__idle__']['loadBalancerCost'] +
          element['cluster-one']['loadBalancerCost'];
        loadBalancerCostArr.push(loadBalancerCost);
        const pvCost =
          element['__idle__']['pvCost'] + element['cluster-one']['pvCost'];
        pvCostArr.push(pvCost);
        const ramCost =
          element['__idle__']['ramCost'] + element['cluster-one']['ramCost'];
        ramCostArr.push(ramCost);
        const sharedCost =
          element['__idle__']['sharedCost'] +
          element['cluster-one']['sharedCost'];
        sharedCostArr.push(sharedCost);
        const externalCost =
          element['__idle__']['externalCost'] +
          element['cluster-one']['externalCost'];
        externalCostArr.push(externalCost);
      }
    }
  });

  const cpuCost = Math.round(
    (cpuCostArr.reduce((a, b) => a + b, 0) / cpuCostArr.length) * 30.5
  );
  const gpuCost = Math.round(
    (gpuCostArr.reduce((a, b) => a + b, 0) / gpuCostArr.length) * 30.5
  );
  const networkCost = Math.round(
    (networkCostArr.reduce((a, b) => a + b, 0) / networkCostArr.length) * 30.5
  );
  const loadBalancerCost = Math.round(
    (loadBalancerCostArr.reduce((a, b) => a + b, 0) /
      loadBalancerCostArr.length) *
      30.5
  );
  const pvCost = Math.round(
    (pvCostArr.reduce((a, b) => a + b, 0) / pvCostArr.length) * 30.5
  );
  const ramCost = Math.round(
    (ramCostArr.reduce((a, b) => a + b, 0) / ramCostArr.length) * 30.5
  );
  const sharedCost = Math.round(
    (sharedCostArr.reduce((a, b) => a + b, 0) / sharedCostArr.length) * 30.5
  );
  const externalCost = Math.round(
    (externalCostArr.reduce((a, b) => a + b, 0) / externalCostArr.length) * 30.5
  );

  if (!load.cpu.length && !Number.isNaN(cpuCost)) {
    dispatch({
      type: ACTIONS.LOADDATA,
      payload: [
        cpuCost,
        gpuCost,
        networkCost,
        loadBalancerCost,
        pvCost,
        ramCost,
        sharedCost,
        externalCost,
      ],
    });
  }

  const actualInfoArr = [];
  for (let i = 1; i <= 14; i++) {
    if (i === 1) {
      actualInfoArr.push(<SideLabel key={i} />);
      continue;
    }
    if (i === 14) actualInfoArr.push(<RowTotal key={i} load={load} />);
    else {
      actualInfoArr.push(
        <InfoBox
          key={i}
          tag={load.tag[i - 2]}
          cpu={load.cpu[i - 2]}
          gpu={load.gpu[i - 2]}
          network={load.network[i - 2]}
          lb={load.lb[i - 2]}
          pv={load.pv[i - 2]}
          ram={load.ram[i - 2]}
          shared={load.shared[i - 2]}
          external={load.external[i - 2]}
          total={load.total[i - 2]}
          dispatch={dispatch}
          reducer={reducer}
        />
      );
    }
  }
  return (
    <div className="actualDisplay">
      <h2>Monthly Cost</h2>
      <MonthContainer />
      <div className="xivContainers">{actualInfoArr}</div>
    </div>
  );
}
