export interface IClusterReducer {
  render: boolean | undefined,
}
export interface INavBarReducer {
  title: string,
}

export interface IReducers {
  clusterReducer: IClusterReducer,
  navBarReducer: INavBarReducer
}
