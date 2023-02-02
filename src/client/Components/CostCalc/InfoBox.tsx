import React from 'react';
import { ACTIONS } from './CostActual';

export default function InfoBox(props) {
  let cpu: number = props.cpu ? props.cpu : 0;
  const gpu: number = props.gpu ? props.gpu : 0;
  const network: number = props.network ? props.network : 0;
  const lb: number = props.lb ? props.lb : 0;
  const pv: number = props.pv ? props.pv : 0;
  const ram: number = props.ram ? props.ram : 0;
  const shared: number = props.shared ? props.shared : 0;
  const external: number = props.external ? props.external : 0;
  const total: number = props.total ? props.total : 0;

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
        placeholder="1.00"
        onChange={(e) => {
          changeMulti(Number(e.target.value));
        }}
      ></input>
      <span>{cpu}</span>
      <span>{gpu}</span>
      <span>{network}</span>
      <span>{lb}</span>
      <span>{pv}</span>
      <span>{ram}</span>
      <span>{shared}</span>
      <span>{external}</span>
      <span>{total}</span>
    </div>
  );
}
