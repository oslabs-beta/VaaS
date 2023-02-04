import React from 'react';

export default function RowTotal(props) {
  const input: string = props.load ? 'load' : 'budget';
  let cpuTotal: number | string = props[input].cpu.reduce(
    (a: number, b: number) => a + b,
    0
  );
  let gpuTotal: number | string = props[input].gpu.reduce(
    (a: number, b: number) => a + b,
    0
  );
  let networkTotal: number | string = props[input].network.reduce(
    (a: number, b: number) => a + b,
    0
  );
  let lbTotal: number | string = props[input].lb.reduce(
    (a: number, b: number) => a + b,
    0
  );
  let pvTotal: number | string = props[input].pv.reduce(
    (a: number, b: number) => a + b,
    0
  );
  let ramTotal: number | string = props[input].ram.reduce(
    (a: number, b: number) => a + b,
    0
  );
  let sharedTotal: number | string = props[input].shared.reduce(
    (a: number, b: number) => a + b,
    0
  );
  let externalTotal: number | string = props[input].external.reduce(
    (a: number, b: number) => a + b,
    0
  );
  let total = props[input].total.reduce((a: number, b: number) => a + b, 0);

  cpuTotal = cpuTotal.toLocaleString();
  gpuTotal = gpuTotal.toLocaleString();
  networkTotal = networkTotal.toLocaleString();
  lbTotal = lbTotal.toLocaleString();
  pvTotal = pvTotal.toLocaleString();
  ramTotal = ramTotal.toLocaleString();
  sharedTotal = sharedTotal.toLocaleString();
  externalTotal = externalTotal.toLocaleString();
  total = total.toLocaleString();

  return (
    <div className="verticalCenter totalColumn">
      <br />
      <span>${cpuTotal}</span>
      <span>${gpuTotal}</span>
      <span>${networkTotal}</span>
      <span>${lbTotal}</span>
      <span>${pvTotal}</span>
      <span>${ramTotal}</span>
      <span>${sharedTotal}</span>
      <span>${externalTotal}</span>
      <span className="topBorderBlack">${total}</span>
    </div>
  );
}
