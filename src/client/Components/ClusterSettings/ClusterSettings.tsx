import React from 'react';
import { ClusterSettings } from '../../Interfaces/ICluster';
import { Delete } from '../../Services';
import { apiRoute } from '../../utils';

const ClusterSettings = (props: ClusterSettings) => {
  const handleDelete = async () => {
    console.log(props.id);
    try {
      const body = {
        clusterId: props.id
      };
      await Delete(apiRoute.getRoute('cluster'), body, { authorization: localStorage.getItem('token') });
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
