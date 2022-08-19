import router from '../router';
import { Request, Response } from "express";
import { Types } from 'mongoose';
import { User } from '../../models';
import { IError } from '../../interfaces/IError';
import authUser from '../../warehouse/middlewares/authUser';
import bcrypt from '../../warehouse/middlewares/bcrypt';

router.route('/auth')
  .post(authUser, bcrypt, async (req: Request, res: Response) => {
    console.log(`Received ${req.method} request at terminal '/api/auth' endpoint`);
    try {
      const { username, firstName, lastName } = req.body;
      const { hashedPassword } = res.locals;
      const userId = new Types.ObjectId();
      const attempt = new User({ 
        _id: userId, 
        username, 
        password: hashedPassword,
        firstName, 
        lastName 
      });
      await attempt.save();
      console.log(`Success: New user [${userId}] stored in MongoDB collection`);
      return res.status(201).json({ cookie: "Here's a cookie" });
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfull POST request: ${err}`
      };
      console.log(err);
      return res.status(error.status).json(error);
    }
  })
  .put(authUser, bcrypt, async (req: Request, res: Response) => {
    console.log(`Received ${req.method} request at terminal '/api/auth' endpoint`);
    try {
      console.log('Success: User login information authenticated');
      return res.status(201).json({ cookie: "Here's a cookie" });
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfull GET request: ${err}`
      };
      console.log(err);
      return res.status(error.status).json(error);
    }
  })


export default router;
