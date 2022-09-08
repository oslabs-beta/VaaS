import React, { useState } from "react";
import { ClusterTypes } from "../../Interfaces/ICluster";
import { Put } from "../../Services";
import { apiRoute } from "../../utils";
import Module from "./Module";
import ClusterSettings from "../Modules/ClusterSettings";
import { useAppDispatch, useAppSelector } from "../../Store/hooks";
import { setFavRender } from "../../Store/actions";
import { IReducers } from "../../Interfaces/IReducers";
import Container from "@mui/system/Container";
import Button from "@mui/material/Button";
import SettingsIcon from "@mui/icons-material/Settings";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import GaugeChart from 'react-gauge-chart';
import "./styles.css";

const Kube = (props: ClusterTypes) => {
  const dispatch = useAppDispatch();
  const clusterReducer = useAppSelector((state: IReducers) => state.clusterReducer);
  const apiReducer = useAppSelector((state: IReducers) => state.apiReducer);

  const [module, setModule] = useState(true);
  const [settings, setSettings] = useState(false);

  const [dbData] = useState(apiReducer.clusterDbData.find(element => element._id === props._id));

  const handleFavorite = async () => {
    try {
      const body = {
        clusterId: props._id,
        favorite: !props.favoriteStatus,
      };
      await Put(
        apiRoute.getRoute("cluster"),
        body,
        {
          authorization: localStorage.getItem("token"),
        }
      );
      dispatch(
        setFavRender(!clusterReducer.favRender)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleSettings = async () => {
    try {
      setModule(!module);
      setSettings(!settings);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container
      sx={{
        minWidth: "100%",
        justifyContent: "left",
        display: "flex",
        direction: "column",
        textAlign: "left",
        backgroundSize: "contain",
        bgColor: "#3a4a5b",
      }}
      id="Kube"
    >
      <div className="Kube-top-row">
        <div className="cluster-title">
          {
            props.favoriteStatus &&
            <span
              className="set-favorite noselect"
              onClick={handleFavorite}
            >
              ❤️
            </span>
          }
          {
            !props.favoriteStatus &&
            <span
              className="set-favorite noselect"
              onClick={handleFavorite}
            >
              🤍
            </span>
          }
          <span className="set-favorite noselect">
            &nbsp;
          </span>
          <b>{"" + dbData?.name}:&nbsp;</b>
          {"" + dbData?.description}
        </div>
        <Button
          sx={{
            color: "#3a4a5b",
          }}
          variant="text"
          id="basic-button"
          onClick={handleSettings}
        >
          {module && <SettingsIcon />}
          {settings && <AnalyticsIcon />}
        </Button>
      </div>
      <div id="overview">
        <div className="ov-box">
          <div className="ov-content">
            <div className="noselect">
              <h3>Summary</h3>
            </div>
            <div>{"Node: " + apiReducer.clusterQueryData[props._id]?.allNodes[0]}</div>
          </div>
        </div>
        <div className="ov-box">
          <div className="ov-content">
            <div className="noselect">
              <h3>CPU Usage</h3>
              <GaugeChart id="gauge-chart3"
                nrOfLevels={30}
                colors={["#FF5F6D", "#FFC371"]}
                arcWidth={0.1}
                percent={apiReducer.clusterQueryData[props._id]?.cpuLoad/100}
                style={{
                  width: '60%',
                  
                }}
                textColor='black'
              />
            </div>
          </div>
        </div>
        <div className="ov-box">
          <div className="ov-content">
            <div className="noselect">
              <h3>Memory Usage</h3>
              <p>{apiReducer.clusterQueryData[props._id]?.memoryLoad + ' /2048 MB'}</p>
              <GaugeChart id="gauge-chart3"
                nrOfLevels={30}
                colors={["#FF5F6D", "#FFC371"]}
                arcWidth={0.1}
                percent={apiReducer.clusterQueryData[props._id]?.memoryLoad/2048}
                style={{
                  width: '60%',
                  
                }}
                textColor='black'
              />
              
            </div>
          </div>
        </div>
        <div className="ov-box">
          <div className="ov-content">
            <div className="noselect">
              <h3>Deployments</h3>
            </div>
            <div>{"" + apiReducer.clusterQueryData[props._id]?.totalDeployments}</div>
          </div>
        </div>
        <div className="ov-box">
          <div className="ov-content">
            <div className="noselect">
              <h3>Pods</h3>
            </div>
            <div>{"" + apiReducer.clusterQueryData[props._id]?.totalPods}</div>
          </div>
        </div>
      </div>
      <div id="module">
        {module && (
          <Module
            id={dbData?._id}
            nested={true}
          />
        )}
        {settings && (
          <ClusterSettings
            id={dbData?._id}
          />
        )}
      </div>
    </Container>
  );
};

export default Kube;
