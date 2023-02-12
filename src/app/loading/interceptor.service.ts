import {
  HttpContextToken,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoadService } from './load.service';

export const BYPASS_INTERCEPTOR = new HttpContextToken(() => false);

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  constructor(public loadingService: LoadService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.context.get(BYPASS_INTERCEPTOR) === true) return next.handle(req);

    this.loadingService.isLoading.next(true);

    return next.handle(req).pipe(
      finalize(() => {
        this.loadingService.isLoading.next(false);
      })
    );
  }
}
