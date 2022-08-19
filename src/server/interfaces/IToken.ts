export interface ITokenHeader {
  alg: string,
  typ: string
}

export interface ITokenData {
  sub: string,
  username: string,
  iat: Date,
  eat: Date
}
