import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, tap, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})

//want to create an AUthGuard so that it will guard certain routes that require authentication
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
    canActivate(route:ActivatedRouteSnapshot, router: RouterStateSnapshot):boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
        //want to return the status of the user. 
        //return the authSerice.user instead of .subsribe() because the authSerice.user is already an observable, however, it is not an 
        //observable that returns a BOOLEAN which is what this AuthGuard requires us to return. 
        //for that you can use .pipe(map) again to transform the observable return
        return this.authService.user.pipe(
            //also use the take(1) here, so we do not have an ungoing subscription. We only want it once, every time the guard is requested. not if we sit on some page, and something changes. At that
            //point, there would be no need for this gurard to keep the subscription open
            take(1),
            map(user=>{
            //return !!user;//use the !! trick to return something that is not null or undefined to true. or return something as null or undefined to false in this case.
            //now you have an observable that truly returns a BOOLEAN.
            //in Angular 8 and below version, you would have had to create a tap operator to re-route the user back to the login screen if they were not logged in
            //in Angular 8 and above you can use the URLTree. 
            const isAuth = !!user;
            if(isAuth) {
                return true;
            }
            return this.router.createUrlTree(['/auth']);
        })
            // , tap(isAuth=>{
            // if(!isAuth) {
            //     this.router.navigate(['/auth']);
            // }
            // })
        );

    }
}