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
  const [favoriteClusters, setFavoriteClusters] = useState<ClusterTypes[]>([]);
  const [clusters, setClusters] = useState<ClusterTypes[]>([]);
  const [homeRender, setHomeRender] = useState(false);

  useEffect(() => {
    console.log('signInState from store:', userReducer.signInState);
    console.log('Signed in username from localStorage:', localStorage.getItem('username'));
    console.log('JWT token stored from localStorage:', localStorage.getItem('token'));
    console.log('Signed in userId from localStorage:', localStorage.getItem('userId'));
    const getClusters = async () => {
      const res = await Get(apiRoute.getRoute('cluster'), { authorization: localStorage.getItem('token') });
      const favArr: ClusterTypes[] = [];
      const arr: ClusterTypes[] = [];
      res.forEach((element: any) => {
        if(element.favorite.includes(localStorage.getItem('userId'))) favArr.push(element);
        else arr.push(element);
      });
      setFavoriteClusters(favArr);
      setClusters(arr);
    };
    getClusters();
  }, [homeRender]);

  return (
    <div>
      <UserWelcome />
      {favoriteClusters.map((element, idx) => {
        return <Cluster
          key={idx}
          description={element.description}
          name={element.name}
          _id={element._id}
          favorite={element.favorite}
          favoriteStatus={true}
          setHomeRender={setHomeRender}
        />;
      })}
      {clusters.map((element, idx) => {
        return <Cluster
          key={idx}
          description={element.description}
          name={element.name}
          _id={element._id}
          favorite={element.favorite}
          favoriteStatus={false}
          homeRender={homeRender}
          setHomeRender={setHomeRender}
        />;
      })}
      <NavBar />
    </div>
  );
};

export default Home;