import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OpenFaaS from "../Modules/OpenFaaS";
import Visualizer from "../Modules/Visualizer";
import CustomQuery from "../Modules/CustomQuery";
import Charts from "../Modules/Charts";
import NavBar from "../Home/NavBar";
import { Modules } from "../../Interfaces/ICluster";
import Container from "@mui/system/Container";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import GrainIcon from "@mui/icons-material/Grain";
import DataObjectIcon from '@mui/icons-material/DataObject';
import FunctionsIcon from '@mui/icons-material/Functions';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import "./styles.css";

const Module = (props: Modules) => {
  const { state }: any = useLocation();
  const navigate = useNavigate();
  const [faas, setFaaS] = useState(true);
  const [visualizer, setVisualizer] = useState(false);
  const [custom, setCustom] = useState(false);
  const [charts, setCharts] = useState(false);
  const [currentModule, setCurrentModule] = useState("module");
  const [id] = useState(props.id || state[0]);
  const [style, setStyle] = useState({
    color: "white",
    minHeight: "100%",
    minWidth: "100%",
    display: "flex",
    textAlign: "left",
    backgroundImage: "linear-gradient(#1f3a4b, #AFAFAF)",
    overflow: "auto",
  });
  const [buttonStyle, setButtonStyle] = useState({
    color: "white",
    width: "1px"
  });

  useEffect(() => {
    if (!props.nested) {
      setStyle({
        color: "black",
        minHeight: "92vh",
        minWidth: "100%",
        display: "flex",
        textAlign: "left",
        backgroundImage: "",
        overflow: "auto",
      });
      setButtonStyle({
        ...buttonStyle,
        color: "#3a4a5b",
      });
      if (state) {
        switch (state[1]) {
          case "faas":
            setFaaS(true);
            setVisualizer(false);
            setCustom(false);
            setCharts(false);
            break;
          case "visualizer":
            setFaaS(false);
            setVisualizer(true);
            setCustom(false);
            setCharts(false);
            break;
          case "custom":
            setFaaS(false);
            setVisualizer(false);
            setCustom(true);
            setCharts(false);
            break;
          case "charts":
            setFaaS(false);
            setVisualizer(false);
            setCustom(false);
            setCharts(true);
            break;
        }
      }
    }
  }, []);

  const handleFaaSButton = () => {
    setFaaS(true);
    setCurrentModule("faas");
    setVisualizer(false);
    setCustom(false);
    setCharts(false);
  };

  const handleVisualizerButton = () => {
    setFaaS(false);
    setVisualizer(true);
    setCurrentModule("visualizer");
    setCustom(false);
    setCharts(false);
  };

  const handleCustomButton = () => {
    setFaaS(false);
    setVisualizer(false);
    setCustom(true);
    setCurrentModule("custom");
    setCharts(false);
  };

  const handleChartsButton = () => {
    setFaaS(false);
    setVisualizer(false);
    setCustom(false);
    setCharts(true);
    setCurrentModule("charts");
  };

  return (
    <div>
      <Container 
        component={Card} 
        sx={style} 
        className="module-container"
      >
        <div className="Module-top-row">
          <div className="module-title noselect">
            {
              faas && 
              <div>
                OpenFaaS
              </div>
            }
            {
              visualizer && 
              <div>
                Visualizer
              </div>
            }
            {
              custom && 
              <div>
                Prom Query
              </div>
            }
            {
              charts && 
              <div>
                Charts
              </div>
            }
          </div>
          <Button
            sx={buttonStyle}
            variant="text"
            id="basic-button"
            className="module-button"
            onClick={handleCustomButton}
          >
            <DataObjectIcon />
          </Button>
          <Button
            sx={buttonStyle}
            variant="text"
            id="basic-button"
            className="module-button"
            onClick={handleChartsButton}
          >
            <QueryStatsIcon />
          </Button>
          <Button
            sx={buttonStyle}
            variant="text"
            id="basic-button"
            className="module-button"
            onClick={handleFaaSButton}
          >
            <FunctionsIcon />
          </Button>
          <Button
            sx={buttonStyle}
            variant="text"
            id="basic-button"
            className="module-button"
            onClick={handleVisualizerButton}
          >
            <GrainIcon />
          </Button>
          {
            props.nested && 
            <Button
              sx={{
                ...buttonStyle,
                marginRight: "-9px",
              }}
              variant="text"
              id="basic-button"
              className="module-button"
              onClick={() =>
                navigate(
                  "/module", 
                  { state: [
                      id, 
                      currentModule, 
                      true
                    ] 
                  }
                )
              }
            >
              <FullscreenIcon />
            </Button>
          }
          {
            !props.nested && 
            <Button
              sx={{
                ...buttonStyle,
                marginRight: "-9px",
              }}
              variant="text"
              id="basic-button"
              className="module-button"
              onClick={() => 
                navigate(
                  "/home", 
                  { state: [id] }
                )
              }
            >
              <FullscreenExitIcon />
            </Button>
          }
        </div>
        <div id="module-content">
          {
            custom && 
            <CustomQuery 
              id={id} 
              nested={props.nested} 
            />
          }
          {
            faas && 
            <OpenFaaS 
              id={id} 
              nested={props.nested} 
            />
          }
          {
            charts && 
            <Charts              
              id={id} 
              nested={props.nested} 
            />
          }
          {
            visualizer && 
            <Visualizer               
              id={id} 
              nested={props.nested} 
            />
          }
        </div>
      </Container>
      <Container 
        className="cluster-id"
        sx={{
          color: style.color
        }}
      >
        {id}
      </Container>
      {
        !props.nested && 
        <NavBar />
      }
    </div>
  );
};

export default Module;
