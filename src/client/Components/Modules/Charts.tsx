import React, { useState, useEffect, ChangeEvent } from "react";
import { Modules } from "../../Interfaces/ICluster";
import { Delete, Get, Post } from "../../Services";
import { apiRoute } from "../../utils";
import { useLocation } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { nodeMetric, podMetric } from "../../Queries";
import { arrayBuffer } from "node:stream/consumers";



ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Charts = (props: Modules) => {
  const { state }: any = useLocation();
  const [id] = useState(props.id || state[0]);

const [gData, setgData] = useState([ {x: 1, y: 15},
  {x: 2, y: 25},
  {x: 3, y: 10},
  ]);

 const options = {

  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const dataPoint = 5;


 const data = {
  labels,
  datasets: [
    {
      label: 'CPU Usage',
      data: gData,
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

let array2: { x: number; y: any; }[] = [];

  const tf2 = async () => {
    array2 = [];
        for(let i = 0; i < 10; i += 1) {
            const cpuData = podMetric.podChart('633b150913820370b3eb61bb','k8',"cows-fbbc8675f-dbs55");
            const slowdown = setTimeout(() => console.log('holds'),500);
            slowdown;
            const cpuDataForGraph = await cpuData;
            const convertedCpuData = cpuDataForGraph?.metric.data.result[0].value[1];
            const datatoPush = {'x': i, 'y': convertedCpuData };
            array2.push(datatoPush);
            if(array2.length > 9) {
              setgData(array2);
            }
        }
        return;
  };
  
  useEffect(() => {
    tf2();
  }, []);

  return (
    <div>
      <button onClick={tf2}>Click this to refresh the data</button>
      <Line options={options} data={data} />;
    </div>
  );
};

export default Charts;
