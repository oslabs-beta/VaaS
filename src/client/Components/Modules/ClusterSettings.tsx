import React, { useEffect } from 'react';
import './styles.css';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { ClusterTypes, Modules } from '../../Interfaces/ICluster';
import { IReducers } from '../../Interfaces/IReducers';
import { Delete } from '../../Services';
import { setRender } from '../../Store/actions';
import { apiRoute } from '../../utils';

const ClusterSettings = (props: Modules) => {
  const clusterReducer = useSelector((state: IReducers) => state.clusterReducer);
  const dispatch = useDispatch();

  const handleDelete = async () => {
    console.log(props.id);
    try {
      const body = {
        clusterId: props.id
      };
      await Delete(apiRoute.getRoute('cluster'), body, { authorization: localStorage.getItem('token') });
      dispatch(setRender(!clusterReducer.render));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div><button onClick={handleDelete} type='button'>Delete Cluster</button></div>
    </div>
  );
};

export default ClusterSettings;
