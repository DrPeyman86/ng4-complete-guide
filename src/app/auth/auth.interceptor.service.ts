import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { AuthService } from "./auth.service";
import { take, exhaustMap, map} from "rxjs/operators";

import * as fromApp from '../store/app.reducer';
import { Store } from "@ngrx/store";

@Injectable()//you do not need to add providedIn: 'root' since you have this interceptor in the providedIn in app.module.ts
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService, private store: Store<fromApp.AppState>){}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        //basically do the same thing here as you did in the data-storate.service.
        //an interceptor would be a better practice rather than having this code in every one of your outgoing REST api call services.
        // return this.authService.user.pipe(
          return this.store.select('auth').pipe(
            take(1),
            //the this.store.select('auth') returns an object of the user state. so you need to extract the user from that object
            //before continuing on with the .pipe()
            map(authState => {
              return authState.user;
            }),
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
