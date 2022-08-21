export interface IAppReducer {
  welcome?: string,
  signInState: boolean,
  username: string | null
  // clusterHealth: [],
}
export interface INavBarReducer {
  title: string,
}

export interface IReducers {
  appReducer: IAppReducer,
  navBarReducer: INavBarReducer
}
