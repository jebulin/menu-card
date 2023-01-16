import { CallHandler, ExecutionContext, Injectable, NestInterceptor, RequestTimeoutException } from "@nestjs/common";
import { catchError, map, Observable, of, timeout, TimeoutError } from "rxjs";

export interface Response{
    data?:any;
    status?:Boolean;
    statusCode?: number| string;
    error?: any
}

@Injectable()
export class RequestInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        // const request = context.switchToHttp().getRequest();

        let responseObject: Response = {};
        // return of(responseObject)
        const response = context.switchToHttp().getResponse();

        return next.handle().pipe(
            map(data =>{
                responseObject.statusCode = response.statusCode;
                responseObject.status = true;
                responseObject.data = data;
                return responseObject;
            }),
timeout(30000),
catchError((err)=>{
    console.log(err);
    responseObject.status = false;
    if(err instanceof TimeoutError ){
        responseObject.statusCode = new RequestTimeoutException().getStatus();
        responseObject.error = new RequestTimeoutException().message;
    }else if(err.hasOwnProperty("response")){
        responseObject.statusCode = err.response.statusCode || 500;
        responseObject.error = err.response.error || String(err);
    }else{
        responseObject.statusCode = err.error!=undefined ? err.error.statusCode: err.statusCode!=undefined? err.statusCode: 500;
        responseObject.error = err.error!=undefined ? err.error.message: err.message!=undefined? err.message: String(err);
    }

    return of(responseObject)
})
        )
    }
}