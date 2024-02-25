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
                if (data.status == false) {
                    responseObject.status = false;
                    responseObject.error = data.error;
                } else {
                    responseObject.data = data
                    responseObject.status = true;
                }
                return responseObject;
            }),
            timeout(20000),
            catchError((err) => {
                let errorObject: Response = {};
                errorObject.status = false;
                if (err instanceof TimeoutError) {
                    errorObject.statusCode = new RequestTimeoutException().getStatus();
                    errorObject.error = new RequestTimeoutException().message;
                } else if (err.hasOwnProperty("response")) {
                    errorObject.statusCode = err.response.statusCode ? err.response.statusCode : err.statusCode || 500;
                    errorObject.error = err.response.message || String(err.response);
                } else {
                    errorObject.statusCode = err.statusCode ? err.statusCode : 500;
                    errorObject.error = err.message ? err.message : String(err);
                }
                return of(errorObject)
            })
        )
    }
}