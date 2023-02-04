import React from 'react';
import { ACTIONS } from './CostActual';

export default function InfoBox(props) {
  let cpu: number | string = props.cpu ? props.cpu : 0;
  let gpu: number | string = props.gpu ? props.gpu : 0;
  let network: number | string = props.network ? props.network : 0;
  let lb: number | string = props.lb ? props.lb : 0;
  let pv: number | string = props.pv ? props.pv : 0;
  let ram: number | string = props.ram ? props.ram : 0;
  let shared: number | string = props.shared ? props.shared : 0;
  let external: number | string = props.external ? props.external : 0;
  let total: number | string = props.total ? props.total : 0;

  cpu = cpu.toLocaleString();
  gpu = gpu.toLocaleString();
  network = network.toLocaleString();
  lb = lb.toLocaleString();
  pv = pv.toLocaleString();
  ram = ram.toLocaleString();
  shared = shared.toLocaleString();
  external = external.toLocaleString();
  total = total.toLocaleString();

  function changeMulti(value: number) {
    props.dispatch({
      type: ACTIONS.CHANGEMULTI,
      payload: [props.tag, value],
    });
  }
  return (
    <div className="verticalCenter">
      <input
        className="inputField"
        type="number"
        placeholder="1.00"
        onChange={(e) => {
          changeMulti(Number(e.target.value));
        }}
      ></input>
      <span>${cpu}</span>
      <span>${gpu}</span>
      <span>${network}</span>
      <span>${lb}</span>
      <span>${pv}</span>
      <span>${ram}</span>
      <span>${shared}</span>
      <span>${external}</span>
      <span className="bold topBorder">${total}</span>
    </div>
  );
}
