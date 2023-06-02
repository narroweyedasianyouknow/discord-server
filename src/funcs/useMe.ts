import { verify } from 'jsonwebtoken';
import type { Request, Response } from 'express';

export const useMe = function (req: Request, ignoreRes?: Response) {
  const authorization = req.cookies?.token;
  if (authorization && process.env.SECRET) {
    let decoded: any;
    try {
      decoded = verify(authorization, process.env.SECRET);
    } catch (e) {
      console.log('ERROR::: DECODED VALUE ERROR');
      return {
        login: undefined,
        user_id: undefined,
      };
    }
    return {
      login: decoded?.login,
      user_id: decoded?.user_id,
    };
  }
  return {
    login: undefined,
    user_id: undefined,
  };
};
