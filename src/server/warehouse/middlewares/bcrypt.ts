import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { User } from '../../models';
import { IError } from '../../interfaces/IError';
import { terminal } from '../../services/terminal';
import bcrypt from 'bcrypt';

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  terminal(`Received ${req.method} request at 'bcrypt' middleware`);

  let { password } = req.body;
  /* IF newAcctInfo (from previous github middleware) exists on locals, set password to be newAcctInfo.password */
  if (res.locals.newAcctInfo) {
    password = res.locals.newAcctInfo.password;
  }
  // console.log('PASSWORD: ', password);
  const saltRounds = 10;
  // IF USER's hashedPassword does not exist, this means this is a new user; set and store new userId and hash password
  if (!res.locals.hashedPassword) {
    res.locals.userId = new Types.ObjectId();
    res.locals.hashedPassword = await bcrypt.hash(password, saltRounds);
    terminal(`Success: Password hashed`);
  } else {
    /* IF USER's hashedPassword (from previous github middleware) does exist, change username to be client input
      query database for user, compare inputed password and password in database and move on to the next middleware if password is correct,
      else throw 'Invalid credentials' error'
  */
    let { username } = req.body;

    if (res.locals.newAcctInfo) {
      username = res.locals.newAcctInfo.username;
    }
    terminal(`Searching for user [${username}] in MongoDB`);
    // { username } is Javascript property value shorthand for { username: username }
    const user = await User.find({ username }).exec();
    terminal(`Success: MongoDB query executed [${username}]`);
    res.locals.userId = user[0]._id;

    const result: boolean = await bcrypt.compare(
      password,
      res.locals.hashedPassword
    );
    if (!result) {
      const error: IError = {
        status: 401,
        message: 'Invalid credentials',
        invalid: true,
      };
      terminal(`Fail: ${error.message}`);
      return res.status(error.status).json(error);
    }
  }
  terminal(`Success: Forwarding ${req.method} request to next middleware`);
  return next();
};
