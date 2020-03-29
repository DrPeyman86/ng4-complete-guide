import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { AuthService } from "./auth.service";
import { take, exhaustMap } from "rxjs/operators";

@Injectable()//you do not need to add providedIn: 'root' since you have this interceptor in the providedIn in app.module.ts
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService){}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        //basically do the same thing here as you did in the data-storate.service. 
        //an interceptor would be a better practice rather than having this code in every one of your outgoing REST api call services. 
        return this.authService.user.pipe(
            take(1), 
            exhaustMap(user=>{
                //...
                if(!user) {
                    return next.handle(req);
                };

                const modifiedReq = req.clone({params: new HttpParams().set('auth', user.token)})
                return next.handle(modifiedReq);
            })
        )    

        
    }
}