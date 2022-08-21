export interface IAppReducer {
  welcome?: string,
  signInState: boolean,
  username: string | null
  // clusterHealth: [],
}
export interface INavBarReducer {
  dropDownName: string,
}

export interface IReducers {
  appReducer: IAppReducer
}