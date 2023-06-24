import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookies = createParamDecorator(
     (data: string, ctx: ExecutionContext): string | undefined => {
          const request = ctx.switchToHttp().getRequest();
          return request.cookies[data];
     },
);
