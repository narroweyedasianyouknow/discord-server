import { verify } from 'jsonwebtoken';
import type { Request } from 'express';

export const useMe = function (req: Request) {
  const authorization = req.cookies?.token;
  if (authorization && process.env.SECRET) {
    let decoded: any;
    try {
      decoded = verify(authorization, process.env.SECRET);
    } catch (e) {
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
