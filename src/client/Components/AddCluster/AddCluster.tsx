import React from 'react';
import { Put } from '../../Services';
import { apiRoute } from '../../utils';
import NavBar from '../Home/NavBar';

const AddCluster = () => {

  const handleAdd = async () => {
    try {
      const body = {
        url: (document.getElementById('cluster-url') as HTMLInputElement).value,
        k8_port: (document.getElementById('k8_port') as HTMLInputElement).value,
        faas_port: (document.getElementById('faas_port') as HTMLInputElement).value,
        name: (document.getElementById('cluster-name') as HTMLInputElement).value,
        description: (document.getElementById('cluster-description') as HTMLInputElement).value,
      };
      await Put(apiRoute.getRoute('cluster'), body, { authorization: localStorage.getItem('token') });

    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <h2>Cluster Settings</h2>
      <p><input id='cluster-url' placeholder='url'/></p>
      <p><input id='k8_port' placeholder='k8_port'/></p>
      <p><input id='faas_port' placeholder='faas_port'/></p>
      <p><input id='cluster-name' placeholder='cluster name'/></p>
      <p><input id='cluster-description' placeholder='description'/></p>
      <button type='button'>Add cluster</button>
      <NavBar />
    </div>
  );
};

export default AddCluster;
