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

export default function CostGraph(props) {
  const input = props.load ? 'load' : 'budget';
  const data = {
    labels: props.monthArr,
    datasets: [
      {
        label: 'CPU',
        data: props[input].cpu,
        //backgroundColor: '#619ED6',
      },
      {
        label: 'GPU',
        data: props[input].gpu,
        //backgroundColor: '#6BA547',
      },
      {
        label: 'Network',
        data: props[input].network,
        //backgroundColor: '#F7D027',
      },
      {
        label: 'LB',
        data: props[input].lb,
        //backgroundColor: '#E48F1B',
      },
      {
        label: 'PV',
        data: props[input].pv,
        //backgroundColor: '#B77EA3',
      },
      {
        label: 'RAM',
        data: props[input].ram,
        //backgroundColor: '#E64345',
      },
      {
        label: 'Shared',
        data: props[input].shared,
        //backgroundColor: '#60CEED',
      },
      {
        label: 'External',
        data: props[input].external,
        //backgroundColor: '#9CF168',
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

    // new Chart(document.getElementById('actualChart'), {
    //   type: 'bar',
    //   data: {
    //     labels: props.monthArr,
    //     datasets: [
    //       {
    //         label: 'CPU',
    //         data: props.load.cpu
    //       },
    //       {
    //         label: 'GPU',
    //         data: props.load.gpu
    //       },
    //       {
    //         label: 'Network',
    //         data: props.load.network
    //       },
    //       {
    //         label: 'LB',
    //         data: props.load.lb
    //       },
    //       {
    //         label: 'PV',
    //         data: props.load.pv
    //       },
    //       {
    //         label: 'RAM',
    //         data: props.load.ram
    //       },
    //       {
    //         label: 'Shared',
    //         data: props.load.shared
    //       },
    //       {
    //         label: 'External',
    //         data: props.load.external
    //       },
    //     ],
    //   },
    //   options: {
    //     scales: {
    //       x: {
    //         stacked: true,
    //       },
    //       y: {
    //         stacked: true,
    //       },
    //     },
    //   },
    // });


  return (
    // <div>
    //   <canvas id="actualChart"></canvas>
    // </div>
    <div>
      <Bar data={data} options={options} />
    </div>
  );
}
