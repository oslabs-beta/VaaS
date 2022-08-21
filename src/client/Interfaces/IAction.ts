export interface IAction {
  type: string,
  payload: any
}

export interface ISignIn {
  signInState: boolean,
  username: string
}

export interface IDeleteUser {
  username: string| null;
}
