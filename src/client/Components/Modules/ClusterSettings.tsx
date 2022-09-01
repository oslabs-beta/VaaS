import React, { useEffect } from 'react';
import './styles.css';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Modules } from '../../Interfaces/ICluster';
import { IReducers } from '../../Interfaces/IReducers';
import { Delete } from '../../Services';
import { setRender } from '../../Store/actions';
import { apiRoute } from '../../utils';
import { Container } from '@mui/system';
import Card from '@mui/material/Card';

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
    <Container component={Card} sx={{
      color: "white",
      minHeight: '143px',
      minWidth: '100%',
      display: 'flex',
      textAlign: 'left',
      marginBottom: '0.5rem',
      backgroundImage: "linear-gradient(#4f4a4b, #AFAFAF)"
    }} className="module-container">
      <div className='Module-top-row'>
        <div className='settings-title noselect'>
          Cluster Settings
        </div>
      </div>
      <div id='module-content'>
        Cluster ID: {props.id}
        <button onClick={handleDelete} type='button'>Delete Cluster</button>
      </div>
    </Container>
  );
};

export default ClusterSettings;
