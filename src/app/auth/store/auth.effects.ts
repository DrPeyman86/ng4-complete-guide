import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';

//now import everything from AuthActions
import * as AuthActions from './auth.actions';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


export interface AuthResponseData {
  //kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean//the ? means that it is optional.
}
//need Injectable so that things can be injected into this class. We are injection actions
@Injectable()

//Actions is one big observable that will give you access to all dispatched actions so that you can react to them
//you just react differently that the reducer because in the reducer you still get access to all dispatched actions, but
//but in the effect class here is that you don't change any state but you can execute any other code that should happen when
//such an action is dispatched and that you can then simply dispatch a new action once that code, which would more than likely be
//asynchronous is done. so this is just a stream of of dispatched actions
//$ some use it as to define that this is an observable. You can use it anywhere that you want to signify something is an observable.
export class AuthEffects {
  //you need to import the @Effect decorator so that the authLogin property would be picked up by ngrx as an Effect.
  @Effect()
  //you can add an effect as a normal property
  //actions$ is an observable so you can .pipe(). no need to call subscribe() because ngrx/effects will call subscribe
  //you now need a special rxjs operator provided by ngrx/effects.
  //ofType allows you to filter for which type of effect you want to continue in this observable pipe you are creating
  //because you can have multiple effects by adding multiple properties to your class and they you can simply define
  //different types of effects that you want to handle in each chain
  authLogin = this.actions$.pipe(
    //ofType says only continue with this observable only if the type of the actions matches the AuthActions.LOGIN_START and nothing else
    //you can have more comma dilimmted items if you want this observable to run for more than one action type
    ofType(AuthActions.LOGIN_START),
    //the login action should give us some login information we need to continue with login process.
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.fireBaseAPIKey,
        {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
        }
        //since we are wanting to return an action here so that the reducer can pick up, that will be an observable.
    //errors in effects must be handled differently than just how services work. the Effect here is an ongoing observable stream. Meaning it must never
    //die as long as the app is running. If it dies, when an error is thrown from the http request above, then the user won't be able to request
    //another login.
    //catchError() ---> you can't just do catchError() like you did in service. because that would kill this stream. It has to be handled differently.
    //you can .pipe() here for the innter observable switchMap. switfhMap returns an observable so you can pipe() again on that inner observable
    //pipe allows us to add operators on the inner observable
    ).pipe(
      map(resData => {
        //return a non-error observable here. this function will also not have to generate an error because otherwise it would still cause the ongoing
        //observable stream to die.
        const expirationDuration = new Date(new Date().getTime() + +resData.expiresIn * 1000);
        return new AuthActions.Login({
          email: resData.email,
          userId: resData.localId,
          token: resData.idToken,
          expirationDate: expirationDuration});
      }),
      catchError( errorRes => {
        //here we have to return a Non-error observable so that our overall stream doesn't die and since switchMap returns the result of this inner
        //observable stream as a new observable to the outer chain, returninig a non-error observable in catch error is crucial so that even inside this
        //error function/handler, it will still return a non-error observable which is picked up by switchMap which is then picked up by the out effects observable
        //..
        //use of() which is a rxjs utility to return a new non-error observable
        //return of();//for now return a non-error observable
        let errorMessage = 'An unknown error occurred!';
        console.log(errorRes);
        if(!errorRes.error || !errorRes.error.error) {
            //you cannot just thrownError because this will return an error and would kill this observable stream. Instead use of()
            // return throwError(errorMessage);
            return of(new AuthActions.LoginFail(errorMessage));
        }
        switch(errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'Email not found';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'Password is not correct';
                break;
        }
        return of (new AuthActions.LoginFail(errorMessage));
      })

    )
    //an effect by default should always needs to dispatch a new actions once it is done because the effect doesn't actually change the state
    //once the effect is done, you do typically want to change the state. For example, if we did login successfully, we want to dispatch a new action
    //that will grant user login/access. then the reducer can take over and grant access to that user. therefore we need to return a new action
    }),


  );

//we need a new Effect to handle the routing after the user has logged in for example to re-route to main page.
@Effect({dispatch: false})//Effects typically return an observable action. If the effect does not return an observable action, then set dispatch to false
authSuccess = this.actions$.pipe(
  ofType(AuthActions.LOGIN),//we used the LOGIN action because we want this effect to only execute when there was a SUCCESS in the LOGIN process, not when LOGIN_START action is executed
  tap(() => {
    this.router.navigate(['/']);
  })
)

  constructor(private actions$: Actions, private http: HttpClient, private router: Router) {}
}
