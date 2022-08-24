import { encode, decode, TAlgorithm } from "jwt-simple";
import { 
  IPartialSession, 
  IEncodeResult, 
  IDecodeResult, 
  ITokenSession, 
  IExpirationStatus
} from '../interfaces/IToken';

export function encodeSession(accessSecret: any, partialSession: IPartialSession): IEncodeResult {
  const algo: TAlgorithm = "HS512";
  const iat = Date.now(), 
    timeToExp = Number(process.env.JWT_EXP), 
    eat = iat + timeToExp;
  const session: ITokenSession = {
    ...partialSession,
    iat: iat,
    eat: eat
  };
  return {
    token: encode(session, accessSecret, algo)
  };
}

export function decodeSession(accessSecret: any, sessionToken: any): IDecodeResult {
  const algorithm: TAlgorithm = "HS512";
  let result: ITokenSession;
  try {
    result = decode(sessionToken, accessSecret, false, algorithm);
  } catch (err: any) {
    if (
      err.message === "No token supplied" || 
      err.message === "Not enough or too many segments" ||
      err.message.indexOf("Unexpected token") === 0
    ) {
      return { type: "invalid-token" };
    }
    if (err.message === "Signature verification failed" || err.message === "Algorithm not supported") {
      return { type: "integrity-error" };
    }
    throw err;
  }
  return {
    type: "valid",
    session: result
  };
}

export function checkExpStatus(token: ITokenSession): IExpirationStatus {
  const now = Date.now();
  if (token.eat > now) return "active";
  const gracePeriod = token.eat + Number(process.env.JWT_grace);
  if (gracePeriod > now) return "grace";
  return "expired";
}
