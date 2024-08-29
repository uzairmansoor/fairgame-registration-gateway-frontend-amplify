import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    constructor() {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // Clone the request and replace the original headers with
        // cloned headers, updated with the authorization.
        let url = req.url;
        // if (!environment.production) url = req.url + '?useDummyService=true';
        const request = req.clone({
            url,
            headers: req.headers.set('X-API-KEY', 'API-1234567890'),
        });

        // send cloned request with header to the next handler.
        return next.handle(request).pipe();
    }
}
