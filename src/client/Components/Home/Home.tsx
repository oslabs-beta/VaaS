import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Box, Button, TextField } from '@mui/material';

import { IReducers } from '../../Interfaces/IReducers';
import { ClusterTypes } from '../../Interfaces/ICluster';
import NavBar from './NavBar';
import Kube from '../Cards/Kube';
import './styles.css';
import { Get } from '../../Services';
import { apiRoute } from '../../utils';

const Home = () => {
  const clusterReducer = useSelector((state: IReducers) => state.clusterReducer);
  const [clusters, setClusters] = useState<ClusterTypes[]>([]);

  useEffect(() => {
    console.log('Signed in username from localStorage:', localStorage.getItem('username'));
    console.log('JWT token stored from localStorage:', localStorage.getItem('token'));
    console.log('Signed in userId from localStorage:', localStorage.getItem('userId'));
    const getClusters = async () => {
      const res = await Get(apiRoute.getRoute('cluster'), { authorization: localStorage.getItem('token') });
      setClusters(res);
    };
    getClusters();
  }, [clusterReducer.render]);

  return (
    <div className="Kube-port">
      <div className="Kube-container">
        {clusters.map((element, idx) => {
          let bool = false;
          if(element.favorite?.includes(localStorage.getItem('userId') as string)) bool = true;
          return <Kube
            key={idx}
            description={element.description}
            name={element.name}
            _id={element._id}
            favorite={element.favorite}
            favoriteStatus={bool}
          />;
        })}
      </div>
      <NavBar />
    </div>
  );
};

export default Home;