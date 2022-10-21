import { Request, Response } from 'express';
import { User } from '../../models';
import { IError } from '../../interfaces/IError';
import { terminal } from '../../services/terminal';
import fetch from "node-fetch";
import 'dotenv';

export default async (req: Request, res: Response, next: (param?: unknown) => void): Promise<void | Response<any, Record<string, any>>> => {
  terminal(`Received ${req.method} request at 'gitAccessToken' middleware`);
  // grab code from body
  const { code } = req.body;
  // make make post request to github to get accesstoken
  const gitClientID = process.env.GITHUB_CLIENT_ID;
  const gitSecret = process.env.GITHUB_SECRET;

  const accessToken = await fetch(`https://github.com/login/oauth/access_token?client_id=${gitClientID}&client_secret=${gitSecret}&code=${code}`,
    {
      method: "POST",
      headers: {
        'Accept': 'application/json',
      }
    }
  ).then((res) => res.json());
  // store token and return next
  res.locals.accessToken = accessToken;
  terminal(`Success: GithubToken received: ${res.locals.accessToken.access_token}`);

  return next();
};
