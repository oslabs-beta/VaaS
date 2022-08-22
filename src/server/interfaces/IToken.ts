export interface ITokenSession {
  id: string;
  username: string;
  iat: number;
  eat: number;
}

export type IPartialSession = Omit<ITokenSession, "iat" | "eat">;

export interface IEncodeResult {
  token: string
}

export type IDecodeResult =
  | {
      type: "valid";
      session: ITokenSession;
    }
  | {
      type: "integrity-error";
    }
  | {
      type: "invalid-token";
    };

export type IExpirationStatus = "expired" | "active" | "grace";