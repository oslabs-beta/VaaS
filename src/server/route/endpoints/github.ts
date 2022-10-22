import router from '../router';
import { Request, Response } from "express";
import { terminal } from '../../services/terminal';
import { IError } from '../../interfaces/IError';
import { gitAccessToken } from '../../warehouse/middlewares';
router.route('/github')
  .post(gitAccessToken, (req: Request, res: Response) => {
    terminal(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    terminal('Rrouting newAcct info back to front-end');
    console.log(res.locals.newAcctInfo);
    return res.status(200).json(res.locals.newAcctInfo);


    // redirect to auth user to set header and create account
  });
export default router;

