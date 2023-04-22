import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export const useMe = function (req: Request, res: Response) {
  const authorization = req.cookies?.token;
  if (authorization && process.env.SECRET) {
    let decoded: any;
    try {
      decoded = verify(authorization, process.env.SECRET);
    } catch (e) {
      return res.status(401).send('unauthorized');
    }
    return decoded?.login;
  }
  return undefined;
};
