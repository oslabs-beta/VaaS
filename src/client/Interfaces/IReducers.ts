export interface IUserReducer {
  welcome?: string,
  signInState: boolean,
  username: string | null
  // clusterHealth: [],
}
export interface INavBarReducer {
  title: string,
}

export interface IReducers {
  userReducer: IUserReducer,
  navBarReducer: INavBarReducer
}
