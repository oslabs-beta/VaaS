import React from 'react';

export default function RowTotal(props) {
  const input: string = props.load ? 'load' : 'budget';
  const cpuTotal = props[input].cpu.reduce((a: number, b: number) => a + b, 0);
  const gpuTotal = props[input].gpu.reduce((a: number, b: number) => a + b, 0);
  const networkTotal = props[input].network.reduce(
    (a: number, b: number) => a + b,
    0
  );
  const lbTotal = props[input].lb.reduce((a: number, b: number) => a + b, 0);
  const pvTotal = props[input].pv.reduce((a: number, b: number) => a + b, 0);
  const ramTotal = props[input].ram.reduce((a: number, b: number) => a + b, 0);
  const sharedTotal = props[input].shared.reduce(
    (a: number, b: number) => a + b,
    0
  );
  const externalTotal = props[input].external.reduce(
    (a: number, b: number) => a + b,
    0
  );
  const total = props[input].total.reduce((a: number, b: number) => a + b, 0);

  return (
    <div className="verticalCenter">
      <br />
      <span>{cpuTotal}</span>
      <span>{gpuTotal}</span>
      <span>{networkTotal}</span>
      <span>{lbTotal}</span>
      <span>{pvTotal}</span>
      <span>{ramTotal}</span>
      <span>{sharedTotal}</span>
      <span>{externalTotal}</span>
      <span>{total}</span>
    </div>
  );
}
