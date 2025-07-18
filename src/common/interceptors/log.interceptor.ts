import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const dateBefore = Date.now();

    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest();
        console.log(`URL ${request.url}`);
        console.log(`URL ${request.method}`);
        console.log(`Tempo de execucao: ${Date.now() - dateBefore} ms`);
      }),
    );
  }
}
