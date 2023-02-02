import React from 'react';

export default function InfoBox(props) {
  return (
    <div className="verticalCenter">
      <input className="inputField"></input>
      <span>{props.cpu}</span>
      <span>{props.gpu}</span>
      <span>{props.network}</span>
      <span>{props.lb}</span>
      <span>{props.pv}</span>
      <span>{props.ram}</span>
      <span>{props.shared}</span>
      <span>{props.external}</span>
    </div>
  );
}
