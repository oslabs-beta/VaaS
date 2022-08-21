import router from '../router';
import { Request, Response } from "express";
import { User } from '../../models';
import { IError } from '../../interfaces/IError';
import { bcrypt, authUser, jwtCreator, jwtVerify } from '../../warehouse/middlewares';

router.route('/auth')
  .get(jwtVerify, async (req: Request, res: Response) => {
    console.log(`Received ${req.method} request at terminal '/api/auth' endpoint`);
    try {
      console.log(`Success: Access to route is allowed`);
      return res.status(201).json({ invalid: false });
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfull GET request: ${err}`
      };
      console.log(err);
      return res.status(error.status).json(error);
    }
  })
  .post(authUser, bcrypt, jwtCreator, async (req: Request, res: Response) => {
    console.log(`Received ${req.method} request at terminal '/api/auth' endpoint`);
    try {
      const { username, firstName, lastName } = req.body, { userId, hashedPassword, jwt } = res.locals;
      const attempt = new User({ 
        _id: userId, 
        username, 
        password: hashedPassword,
        firstName, 
        lastName 
      });
      await attempt.save();
      console.log(`Success: New user [${userId}] stored in MongoDB collection`);
      return res.status(201).header("x-auth-token", jwt).json(jwt);
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to fulfull POST request: ${err}`
      };
      console.log(err);
      return res.status(error.status).json(error);
    }
  })
  .put(authUser, bcrypt, jwtCreator, async (req: Request, res: Response) => {
    console.log(`Received ${req.method} request at terminal '/api/auth' endpoint`);
    try {
      const { jwt } = res.locals;
      console.log('Success: User login information authenticated');
      return res.status(201).header("x-auth-token", jwt).json(jwt);
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
