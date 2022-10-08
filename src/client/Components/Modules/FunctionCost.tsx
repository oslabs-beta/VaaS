import React, { useState, useEffect, ChangeEvent } from "react";
import { Modules } from "../../Interfaces/ICluster";
import { Get } from "../../Services";
import { apiRoute } from "../../utils";
import { useAppDispatch, useAppSelector } from "../../Store/hooks";
import { useLocation } from "react-router-dom";
import { IReducers } from "../../Interfaces/IReducers";
import { Container, TextField, Button } from '@mui/material';


const FunctionCost = (props: Modules) => {
  const { state }: any = useLocation();
  const [id] = useState(props.id || state[0]);
  const OFReducer = useAppSelector((state: IReducers) => state.OFReducer);
  const deployedFunctions = OFReducer.deployedFunctions || [];

  useEffect(() => {
    // fullscreen mode adjustment  
  }, []); 


  return (
    <Container
      sx={{
        width: '100%',
        textAlign: 'center'
      }}
    >
    <div>HI</div>
    </Container>
  );

}; 
export default FunctionCost;
