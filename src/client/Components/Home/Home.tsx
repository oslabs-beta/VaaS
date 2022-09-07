import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import { storeClusters } from '../../Store/actions';
import { ClusterTypes } from '../../Interfaces/ICluster';
import NavBar from './NavBar';
import Kube from '../Cards/Kube';
import { Get } from '../../Services';
import { apiRoute } from '../../utils';
import { IReducers } from '../../Interfaces/IReducers';
import './styles.css';

const Home = () => {
  const clusterReducer = useAppSelector((state: IReducers) => state.clusterReducer);
  const apiReducer = useAppSelector((state: IReducers) => state.apiReducer);
  const [clusters, setClusters] = useState<ClusterTypes[]>([]);
  const [noClusterError, setNoClusterError] = useState('');
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    console.log('Signed in username from localStorage:', localStorage.getItem('username'));
    console.log('JWT token stored from localStorage:', localStorage.getItem('token'));
    console.log('Signed in userId from localStorage:', localStorage.getItem('userId'));
    const getClusters = async () => {
      const res = await Get(
        apiRoute.getRoute('cluster'), 
        { 
          authorization: localStorage.getItem('token') 
        }
      );
      if (res.message) {
        setNoClusterError('Please add cluster information in administrator portal');
      } else {
        setClusters(res);
        dispatch(storeClusters(res));
      }
    };
    getClusters(); 
  }, [clusterReducer.render]);
  console.log('THIS IS APIREDUCER', apiReducer.clusters);

  const favClusters: JSX.Element[] = [];
  const nonFavClusters: JSX.Element[] = [];

  apiReducer.clusters.forEach((element, idx) => {
    if (element.favorite?.includes(localStorage.getItem('userId') as string)) {
      favClusters.push(<Kube
        key={'fav' + idx}
        url={element.url}
        k8_port={element.k8_port}
        faas_port={element.faas_port}
        name={element.name}
        description={element.description}
        _id={element._id}
        favorite={element.favorite}
        favoriteStatus={true}
      />);
    } else {
      nonFavClusters.push(<Kube
        key={'nonFav' + idx}
        url={element.url}
        k8_port={element.k8_port}
        faas_port={element.faas_port}
        name={element.name}
        description={element.description}
        _id={element._id}
        favorite={element.favorite}
        favoriteStatus={false}
      />);
    }
  });

  return (
    <div className="Kube-port">
      <div className="Kube-container">
        {favClusters}
        {nonFavClusters}
      </div>
      {noClusterError}
      <NavBar />
    </div>
  );
};

export default Home;