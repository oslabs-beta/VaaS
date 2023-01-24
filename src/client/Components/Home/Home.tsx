import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import { storeClusterDbData, setDarkMode } from '../../Store/actions';
import { ClusterTypes, IReducers } from '../../Interfaces';
import { fetchClusters, fetchUser } from '../../Queries';
import NavBar from './NavBar';
import Kube from '../Cards/Kube';
import MenuSidebar from './MenuSidebar';
import './styles.css';

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const uiReducer = useAppSelector((state: IReducers) => state.uiReducer);
  const [noClusterError, setNoClusterError] = useState('');
  const [clustersArray, setClustersArray] = useState<ClusterTypes[]>([]);
  const darkMode = uiReducer.clusterUIState.darkmode;
  const { data, refetch } = useQuery({
    queryKey: ['cluster'],
    queryFn: fetchClusters,
  });
  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });

  useEffect(() => {
    if (data?.invalid) return navigate('/');
    if (data?.message) {
      setNoClusterError(
        'Please add cluster information in administrator portal'
      );
      return;
    }
    dispatch(storeClusterDbData(data));
    setClustersArray(data);
  }, [data, dispatch, navigate, refetch]);

  //* Added to load darkmode state when navigating to home, (was just at admin load) -mcm
  useEffect(() => {
    if (userData?.invalid) return navigate('/');
    dispatch(setDarkMode(userData?.darkMode));
    userData?.darkMode
      ? (document.body.style.backgroundColor = '#34363b')
      : (document.body.style.backgroundColor = '#3a4a5b');
  }, [darkMode, dispatch, navigate, userData]);

  return (
    <div>
      {/* <MenuSidebar /> */}
      <NavBar refetch={refetch} />
      <div id="HeaderContainer">
        <div id="Home-Bar-Title">CLUSTERS</div>
      </div>
      <div className="Kube-port">
        <div className="Kube-container" id="Kube-container">
          {clustersArray?.length &&
            clustersArray?.map((cluster, index) => (
              <Kube
                isDark={darkMode} //*adding for darkmode
                key={index}
                _id={cluster._id}
                favorite={cluster.favorite}
                favoriteStatus={true}
                refetch={refetch}
              />
            ))}
        </div>
        {noClusterError}
      </div>
    </div>
  );
};

export default Home;
