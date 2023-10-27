import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment.development';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = localStorage.getItem(environment.token); 
    if (authToken) {
      request = request.clone({
        setHeaders: {
          'Authorization': environment.apiAuthorizationType + " " + authToken
        }
      });
    }
    return next.handle(request);
  }
}
