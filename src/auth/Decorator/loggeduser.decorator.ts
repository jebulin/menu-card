import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Loggeduser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const headers = request.headers;
    //Add shopInfo to the user object
    request.user["shopInfo"] = {
      "shopId": headers["x-shop-id"],
    //   "userId": headers["x-user-id"] || null, "competitorId": headers["x-competitor-id"] || null
    }
    return request.user;
  },
);