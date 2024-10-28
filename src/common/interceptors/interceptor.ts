import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import { map, Observable } from "rxjs";

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: data && data.message ? data.message : "",
        data: {
          result: data,
          meta: {} // if this is supposed to be the actual return then replace {} with data.result
        }
      }))
    );
  }
}
