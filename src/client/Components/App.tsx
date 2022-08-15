import * as React from 'react';
import { apiRoute } from '../utils';
import { AppStates, AppProps } from '../Interfaces/IApp';
import { Get, Post, Put, Delete } from '../Services/index';


export default class App extends React.Component<AppStates, AppProps> {
  state: AppStates = {
    welcome: 'Welcome to VaaS'
  };

  setWelcome = async (): Promise<void> => {
    console.log('You can set state to change welcome message')
  }

  sampleGet = async (): Promise<void> => {
    try {
      const res = await Get(apiRoute.getRoute('sample'));
      console.log(res);
    } catch (err) {
      console.log('Get failed');
    }
  }

  render() {
    return (
      <div>
        {this.state.welcome}
      </div>
    );
  }
}
