import { Injectable } from '@nestjs/common';
import type { NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
     use(req: Request, res: Response, next: NextFunction) {
          const authorization = req.cookies?.token;
          if (!process.env.SECRET) {
               res.status(500).send('Server Error!');
               return;
          }
          if (!authorization) {
               res.status(401).send('Not authorized');
               return;
          }
          try {
               const decoded = verify(authorization, process.env.SECRET);
               const expiryDate = new Date();
               expiryDate.setMonth(expiryDate.getMonth() + 1);
               if (typeof decoded !== 'string') {
                    // sign(
                    //   {
                    //     login: decoded?.login,
                    //   },
                    //   process.env.SECRET,
                    //   {
                    //     expiresIn: +expiryDate,
                    //   },
                    // );
               } else {
                    res.status(500).send('Server Error!');
                    return;
               }
               return next();
          } catch (e) {
               return next(new Error('Not authorized'));
          }
     }
}
