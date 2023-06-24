import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { verify } from 'jsonwebtoken';

export const Profile = createParamDecorator((data, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest() as Request;
      const authorization = request.cookies['token'];
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
});
