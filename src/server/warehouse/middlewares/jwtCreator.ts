import { Request, Response } from 'express';
import { encodeSession } from '../../services/jwt';
import { PartialSession } from '../../interfaces/IToken';
import 'dotenv';

export default (req: Request, res: Response, next: (param?: unknown) => void): void => {
  const { username } = req.body, { userId } = res.locals.userId;
  const partialSession: PartialSession = {
    id: userId,
    username: username
  };
  res.locals.jwt = encodeSession(process.env.JWT_ACCESS_SECRET, partialSession);
  console.log(`Success: JWT created: ${res.locals.jwt} for ${username}`);
  return next();
};
