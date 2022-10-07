import React, { useState, useEffect, ChangeEvent } from "react";
import { Modules } from "../../Interfaces/ICluster";
import { Get } from "../../Services";
import { apiRoute } from "../../utils";
import { useAppDispatch, useAppSelector } from "../../Store/hooks";
import { IReducers } from "../../Interfaces/IReducers";


const FunctionCost = (props: Modules) => {
  const { state }: any = useLocation();
  const [id] = useState(props.id || state[0]);


  // 
}; 