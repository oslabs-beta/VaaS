export interface IAppReducer {
  welcome?: string,
  signInState: boolean,
  username: string
  // clusterHealth: [],
}

export interface IReducers {
  appReducer: IAppReducer
}