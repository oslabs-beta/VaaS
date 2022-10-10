import React, { useState, useEffect, ChangeEvent } from "react";
import { Modules } from "../../Interfaces/ICluster";
import { Delete, Get, Post } from "../../Services";
import { apiRoute } from "../../utils";
import { useLocation } from "react-router-dom";

const Charts = (props: Modules) => {
  const { state }: any = useLocation();
  const [id] = useState(props.id || state[0]);

  useEffect(() => {
    console.log('placeholder');
  }, []);

  return (
    <div>
      <iframe src="http://localhost:3001/d-solo/oWe9aYxmk/1-kubernetes-deployment-statefulset-daemonset-metrics?orgId=1&refresh=30s&from=1665408311835&to=1665419111835&panelId=2" width="450" height="200" frameBorder="0"></iframe>
      <iframe src="http://localhost:3001/d-solo/oWe9aYxmk/1-kubernetes-deployment-statefulset-daemonset-metrics?orgId=1&refresh=30s&from=1665428866939&to=1665439666939&panelId=3" width="450" height="200" frameBorder="0"></iframe>
      <iframe src="http://localhost:3001/d-solo/oWe9aYxmk/1-kubernetes-deployment-statefulset-daemonset-metrics?orgId=1&refresh=30s&from=1665428398962&to=1665439198962&panelId=11" width="450" height="200" frameBorder="0"></iframe>
    </div>
  );
};

export default Charts;
