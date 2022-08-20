export interface IAction {
  type: string,
  payload: any
}

export interface ISignIn {
  signInState: boolean,
  username: string | null
}