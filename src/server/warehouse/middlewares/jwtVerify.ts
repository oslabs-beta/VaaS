import { Request, Response } from 'express';
import { decodeSession, checkExpStatus } from '../../services/jwt';
import { IError } from '../../interfaces/IError';

export default async (req: Request, res: Response, next: (param?: unknown) => void): Promise<void | Response> => {

  next();
};