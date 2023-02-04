import router from '../router';
import { Request, Response } from 'express';
import { terminal } from '../../services/terminal';
import { IError } from '../../interfaces/IError';
import { User } from '../../models';

router.route('/gcheck').post((req: Request, res: Response) => {
  const { username } = req.body;

  User.find({ username: username })
    .then((response) => {
      //console.log(response);
      if (response[0]) res.status(200).json(true);
      else res.status(200).json(false);
    })
    .catch((err) => {
      const error: IError = {
        status: 500,
        message: `Failed at gcheck: ${err}`,
      };
      terminal(`fail: ${error}`);
    });
});

export default router;
