import React, { useEffect } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Colors,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Colors
);

export default function CostGraph(props: any) {
  const input = props.load ? 'load' : 'budget';
  const data = {
    labels: props.monthArr,
    datasets: [
      {
        label: 'CPU',
        data: props[input].cpu,
      },
      {
        label: 'GPU',
        data: props[input].gpu,
      },
      {
        label: 'Network',
        data: props[input].network,
      },
      {
        label: 'LB',
        data: props[input].lb,
      },
      {
        label: 'PV',
        data: props[input].pv,
      },
      {
        label: 'RAM',
        data: props[input].ram,
      },
      {
        label: 'Shared',
        data: props[input].shared,
      },
      {
        label: 'External',
        data: props[input].external,
      },
    ],
  };
  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
}
