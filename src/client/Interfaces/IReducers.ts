export interface IClusterReducer {
  render: boolean,
}
export interface INavBarReducer {
  title: string,
}

export interface IReducers {
  clusterReducer: IClusterReducer,
  navBarReducer: INavBarReducer
}
