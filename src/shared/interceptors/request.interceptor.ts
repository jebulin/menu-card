import { CallHandler, ExecutionContext, Injectable, NestInterceptor, RequestTimeoutException } from "@nestjs/common";
import { catchError, map, Observable, of, timeout, TimeoutError } from "rxjs";

export interface Response {
    data?: any;
    status?: Boolean;
    statusCode?: number | string;
    error?: any
}

@Injectable()
export class RequestInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        // const request = context.switchToHttp().getRequest();

        let responseObject: Response = {};
        // return of(responseObject)
        const response = context.switchToHttp().getResponse();

        return next.handle().pipe(
            map(data => {
                responseObject.statusCode = data.statusCode || 200;
                responseObject.status = true;
                responseObject.data = data;
                return responseObject;
            }),
            timeout(20000),
            catchError((err) => {
                responseObject.status = false;
                if (err instanceof TimeoutError) {
                    responseObject.statusCode = new RequestTimeoutException().getStatus();
                    responseObject.error = new RequestTimeoutException().message;
                } else if (err.hasOwnProperty("response")) {
                    responseObject.statusCode = err.response.statusCode ? err.response.statusCode : err.statusCode || 500;
                    responseObject.error = err.response.message || String(err.response);
                } else {
                    responseObject.statusCode = err.statusCode ? err.statusCode : 500;
                    responseObject.error = err.message ? err.message : String(err);
                }
                return of(responseObject)
            })
        )
    }
}