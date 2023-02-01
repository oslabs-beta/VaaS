import React from 'react';

export default function InfoBox() {
  return (
    <div className="verticalCenter">
      <input className="inputField"></input>
      <span>CPU</span>
      <span>GPU</span>
      <span>Network</span>
      <span>Load Balancer</span>
      <span>Persistent Volume</span>
      <span>RAM</span>
      <span>Shared</span>
      <span>External</span>
    </div>
  );
}
