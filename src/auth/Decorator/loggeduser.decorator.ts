import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Loggeduser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const headers = request.headers;
    //Add shopInfo to the user object
    request.user["shopInfo"] = {
      "shopId": headers["x-shop-id"],
    }
    return request.user;
  },
);