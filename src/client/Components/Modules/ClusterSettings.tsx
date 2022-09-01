import React from 'react';
import './styles.css';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import { Modules } from '../../Interfaces/ICluster';
import { Delete } from '../../Services';
import { setRender } from '../../Store/actions';
import { apiRoute } from '../../utils';
import { Container } from '@mui/system';
import Card from '@mui/material/Card'

const ClusterSettings = (props: Modules) => {
  const clusterReducer = useAppSelector(state => state.clusterReducer);
  const dispatch = useAppDispatch();

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
