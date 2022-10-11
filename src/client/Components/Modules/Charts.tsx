import React, { useState, useEffect, ChangeEvent } from "react";
import { Modules } from "../../Interfaces/ICluster";
import { Delete, Get, Post } from "../../Services";
import { apiRoute } from "../../utils";
import { useLocation } from "react-router-dom";

const Charts = (props: Modules) => {
  const { state }: any = useLocation();
  const [id] = useState(props.id || state[0]);
  const [grafanaCharts, setGrafanaCharts] = useState([])

  useEffect(() => {
    console.log('placeholder');
  }, []);

  return (
    <div>
      <iframe src="http://localhost:3001/d-solo/oWe9aYxmk/1-kubernetes-deployment-statefulset-daemonset-metrics?orgId=1&refresh=15s&from=1665438085393&to=1665448885393&panelId=9" width="450" height="200" frameBorder="0"></iframe>
      <iframe src="http://localhost:3001/d-solo/oWe9aYxmk/1-kubernetes-deployment-statefulset-daemonset-metrics?orgId=1&refresh=30s&from=1665438067436&to=1665448867436&panelId=8" width="450" height="200" frameBorder="0"></iframe>
      <iframe src="http://localhost:3001/d-solo/oWe9aYxmk/1-kubernetes-deployment-statefulset-daemonset-metrics?orgId=1&refresh=30s&from=1665408311835&to=1665419111835&panelId=2" width="450" height="200" frameBorder="0"></iframe>
      <iframe src="http://localhost:3001/d-solo/oWe9aYxmk/1-kubernetes-deployment-statefulset-daemonset-metrics?orgId=1&refresh=30s&from=1665438107076&to=1665448907076&panelId=11" width="450" height="200" frameBorder="0"></iframe>
      <iframe src="http://localhost:3001/d-solo/zrP9cXD7k/cluster-and-node-health-and-scaling?orgId=1&from=1665437987775&to=1665448787775&panelId=5" width="450" height="200" frameBorder="0"></iframe>
      <iframe src="http://localhost:3001/d-solo/zrP9cXD7k/cluster-and-node-health-and-scaling?orgId=1&from=1665438024893&to=1665448824893&panelId=22" width="450" height="200" frameBorder="0"></iframe>
      <iframe src="http://localhost:3001/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=1m&from=1665362750915&to=1665449150915&panelId=78" width="450" height="200" frameBorder="0"></iframe>
      <iframe src="http://localhost:3001/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=1m&from=1665362765553&to=1665449165553&panelId=77" width="450" height="200" frameBorder="0"></iframe>
      <iframe src="http://localhost:3001/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=1m&from=1665362773502&to=1665449173502&panelId=74" width="450" height="200" frameBorder="0"></iframe>
      <iframe src="http://localhost:3001/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=1m&from=1665362781278&to=1665449181278&panelId=152" width="450" height="200" frameBorder="0"></iframe>



      <iframe src="http://localhost:3001/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=1m&from=1665363851043&to=1665450251043&panelId=20" width="450" height="200" frameBorder="0"></iframe>
      <iframe src="http://localhost:3001/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=1m&from=1665363867167&to=1665450267167&panelId=155" width="450" height="200" frameBorder="0"></iframe>
      <iframe src="http://localhost:3001/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=1m&from=1665363875492&to=1665450275493&panelId=19" width="450" height="200" frameBorder="0"></iframe>

      <iframe src="http://localhost:3001/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=1m&from=1665363884075&to=1665450284075&panelId=16" width="450" height="200" frameBorder="0"></iframe>
      <iframe src="http://localhost:3001/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=1m&from=1665363894158&to=1665450294158&panelId=21" width="450" height="200" frameBorder="0"></iframe>
      <iframe src="http://localhost:3001/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=1m&from=1665363925967&to=1665450325967&panelId=154" width="450" height="200" frameBorder="0"></iframe>
      <iframe src="http://localhost:3001/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=1m&from=1665363939355&to=1665450339355&panelId=14" width="450" height="200" frameBorder="0"></iframe>
      <iframe src="http://localhost:3001/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=1m&from=1665363960556&to=1665450360556&panelId=23" width="450" height="200" frameBorder="0"></iframe>
      <iframe src="http://localhost:3001/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=1m&from=1665363971442&to=1665450371442&panelId=75" width="450" height="200" frameBorder="0"></iframe>

      <iframe src="http://localhost:3001/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=1m&from=1665363986855&to=1665450386855&panelId=18" width="450" height="200" frameBorder="0"></iframe>

      {/* {for(let i = 0; i<10; i++) {

      }} */}
      <iframe src="http://localhost:3001/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=1m&from=1665363996561&to=1665450396561&panelId=15" width="450" height="200" frameBorder="0"></iframe>

      <iframe src="http://localhost:3001/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=1m&from=1665420978439&to=1665507378439&panelId=20" width="450" height="200" frameBorder="0"></iframe>

    </div>
  );
};

export default Charts;
