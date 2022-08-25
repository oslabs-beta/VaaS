import { Request, Response } from 'express';
import { terminal } from '../../services/terminal';

export default (req: Request, res: Response, next: (param?: unknown) => void): void => {
  console.clear();
  const date: Date = new Date();
  terminal([{
    date: `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`,
    method: req.method,
    url: `${req.baseUrl}${req.url}`,
    body: req.body,
    query: req.query
  }]);
  return next();
};
