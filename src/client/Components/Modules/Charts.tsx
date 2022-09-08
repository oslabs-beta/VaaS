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

    </div>
  );
};

export default Charts;
