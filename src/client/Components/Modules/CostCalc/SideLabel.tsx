import React from 'react';

export default function SideLabel() {
  return (
    <div className="verticalLeft">
      <span>Multiplier</span>
      <span>CPU</span>
      <span>GPU</span>
      <span>Network</span>
      <span>Load Bal.</span>
      <span>Persist. Vol.</span>
      <span>RAM</span>
      <span>Shared</span>
      <span>External</span>
      <span className="bold topBorderLeft">Total</span>
    </div>
  );
}
