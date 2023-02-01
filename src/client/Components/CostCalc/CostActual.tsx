import React, { useState, useEffect, useReducer } from 'react';
import './costStyle.css';
import InfoBox from './InfoBox';
import MonthContainer from './MonthContainer';
import SideLabel from './SideLabel';

function reducer(load, action: string) {
  switch(action)
}

const ACTIONS = {
  LOADDATA: 'load_data',
  CHANGEMULTI: 'change_multi',
};

export default function CostActual() {
  const [data, setData] = useState([]);
  const [load, dispatch] = useReducer(reducer, {
    multi: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    cpu: [],
    gpu: [],
    network: [],
    lb: [],
    pv: [],
    ram: [],
    shared: [],
    external: [],
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

  for (let i = 0; i < 12; i++) {

  }

  const actualInfoArr = [];
  for (let i = 1; i <= 13; i++) {
    if (i === 1) actualInfoArr.push(<SideLabel />);
    actualInfoArr.push(
      <InfoBox load={load} dispatch={dispatch} reducer={reducer} />
    );
  }

  return (
    <div className="actualDisplay">
      <h2>Monthly Cost</h2>
      <MonthContainer />
      <div className="xivContainers">{actualInfoArr}</div>
    </div>
  );
}
