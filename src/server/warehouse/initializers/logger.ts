import { NextFunction, Request, Response } from 'express';
import { terminal } from '../../services/terminal';

// LOGS WHEN A REQUEST IS MADE
export default (req: Request, res: Response, next: NextFunction): void => {
  console.clear();
  const date: Date = new Date();
  terminal([
    {
      date: `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`,
      method: req.method,
      url: `${req.baseUrl}${req.url}`,
      body: req.body,
      query: req.query,
    },
  ]);
  return next();
};
