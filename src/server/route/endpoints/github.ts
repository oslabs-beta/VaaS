import router from '../router';
import { Request, Response } from "express";
import { terminal } from '../../services/terminal';
import { IError } from '../../interfaces/IError';
import { gitAccessToken } from '../../warehouse/middlewares';
router.route('/github')
  .post(gitAccessToken, (req: Request, res: Response) => {
    res.status(200).json("HEREEE");
  });
export default router;

