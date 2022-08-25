import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { IReducers } from '../../Interfaces/IReducers';
import { ClusterTypes } from '../../Interfaces/ICluster';
import NavBar from './NavBar';
import UserWelcome from './UserWelcome';
import Cluster from '../Cards/Cluster';
import './styles.css';
import { Get } from '../../Services';
import { apiRoute } from '../../utils';

const Home = () => {
  const userReducer = useSelector((state: IReducers) => state.userReducer);
  const [clusters, setClusters] = useState<ClusterTypes[]>([]);

  useEffect(() => {
    console.log('signInState from store:', userReducer.signInState);
    console.log('Signed in username from localStorage:', localStorage.getItem('username'));
    console.log('JWT token stored from localStorage:', localStorage.getItem('token'));
    console.log('Signed in userId from localStorage:', localStorage.getItem('userId'));
    const getClusters = async () => {
      const res = await Get(apiRoute.getRoute('cluster'), { authorization: localStorage.getItem('token') });
      setClusters(res);
    };
    getClusters();
  }, [clusters.length]);

  return (
    <div>
      <NavBar />
      <UserWelcome />
      {clusters.map((element, idx) => {
        return <Cluster
          key={idx}
          description={element.description}
          name={element.name}
          _id={element._id}
          favorite={element.favorite}
        />;
      })}
    </div>
  );
};

export default Home;