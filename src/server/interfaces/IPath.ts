export interface IPathRoute {
  methods: string[];
}

export interface IPath {
  [route: string]: IPathRoute
}
