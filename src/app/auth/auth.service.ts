import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { throwError, Subject, BehaviorSubject } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";

export interface AuthResponseData {
    //kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean//the ? means that it is optional. 
}

@Injectable({providedIn: 'root'})

export class AuthService {
    //create a user property and set it as a Subject. So that we can EMIT events to the subject, whenever a user logs in or logs out. 
    //user = new Subject<User>();
    //after adding authentication and wanting to pass in the token to certain requests, replace the user subject with BehaviorSubject.
    //BehaviorSubject is mainly the same thing as a subject, where you can emit and subscribe to it. 
    //Difference is BehaviorSubject also gives Subscribers of this subject, the previously held value of the subject. 
    //so if the user for example had a user.id = 2. and it changed based on some method, to user.id = 4...when you emit the new value of 4. 
    //the subscribers of the user subject, will also receive the previous value of user.id = 2, in addition of the new user.id = 4. 
    //they will receive the previously held value even if they have not subscribe() to the subject when the previous value of user.id = 2 was emitted for example. 
    //so if you have a component that initialized and subscribes to the subject and receives a value user.id = 2. then you close and unsubscribe() after leaving that component.
    //you go to another component and that component does something that emits the subject and changes value to user.id = 4 and you subscribe() to it then. The second component never 
    //knew or subscribed() to the original value...regardless, at that point, Angualr would know of the previous value of user.id = 2...and using BehaviorSubject would have caused the 
    //second component to also receive the previous value user.id = 2 in addition of the new value user.id = 4.
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;
    constructor(private http: HttpClient, private router: Router){}

    signup(email: string, password: string) {
        //return the observable from the post method, which you can subscribe to. subscribe to it in the component that the method is called.
        //we know the response data will be of type AuthResponseData.
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD9MTw6WXk0KAQDOmmsodF0zks_LBC5qgQ', 
            {
                email: email, 
                password: password, 
                returnSecureToken: true 
            }
        )
        //tap operator steps into the observable chain, but it doesn't disturb the response from following through. 
        .pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(
                resData.email,
                resData.localId,
                resData.idToken,
                +resData.expiresIn
            )
        }))

    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD9MTw6WXk0KAQDOmmsodF0zks_LBC5qgQ',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        )
        //the tap operator can be placed to do extra process without disturbing the regular process. 
        //in this case we just want the tap operator to handle setting the user that was just logged in without necessarily 
        //making the client wait for this process to set the user. 
        //this.handleError refers to the method handleError below. So when an error occurs on this request, 
        //it will forward it to the handleError below, which the handleError method returns something. 
        //that something is the error message, which ultimately gets sent to the .subscribe() of whereever this
        //request was being requested, in the auth.component.ts in this case.
        .pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(
                resData.email,
                resData.localId,
                resData.idToken,
                +resData.expiresIn
            )
            // const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
            // const user = new User(resData.email, resData.localId, resData.idToken, expirationDate);
            // this.user.next(user);
        }))
    }

    logout() {
        this.user.next(null);//just set the user to null so that all components subscribing to the user subject, will know it's null, meaning it is not authenticated.
        localStorage.removeItem('userData');
        this.router.navigate(['/auth'])
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    //this method will look at the localStorage and determine whether the user was logged in, if the page is refreshed. 
    autoLogin() {
        const userData:{
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: Date
        } = JSON.parse(localStorage.getItem('userData'));
        if(!userData){
            return;
        }

        //instantiate a new User class, by replacing the information of the user from the localStorage if it exists. 
        const loadedUser = new User(userData.email,userData.id,userData._token, new Date(userData._tokenExpirationDate))

        //the User class checks for if the token is valid or not based on the _tokenExpirationDate, so all you need to do here is 
        //make sure whether token comes back or not, if it does, then we know the token is still valid, so we call this.user.next() with the loadedUser from localstorage
        if(loadedUser.token) {
            this.user.next(loadedUser);
            //since the page was refreshed, we need to determine how much time is left on the original expirationDate, minus the time that has already elapsed before the page was
            //refreshed. You need to subtract the original _tokenExpirationDate by the current time in miliseconds. 
            //and pass that miliseconds value as an argument to the autoLogout() method, which will then resume with that timeout value.
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    //expirationDuration should be in miliseconds 
    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(()=>{
            this.logout()
        }, expirationDuration)
    }

    //create a private method since this method would not be used outside of this service. 
    //create one method to handle both signup and login. 
    private handleAuthentication(email: string,userId:string, token: string, expiresIn: number) {
        //expiresIn is a number in miliseconds, so need to .getTime() of the current Date(), which returns in seconds since 1970 from JS, multiply expiresIn by 1000
        //to turn it into seconds, add it to the current .getTime(). Then revert itback to a normal "Date()" value and set the variable. 
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(
            email, 
            userId, 
            token, 
            expirationDate);
        //email .next() event on the newly created user so that the app would know about it. 
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);//the expires in miliseconds multiply by 1000 equals 1 hour. 
        localStorage.setItem('userData', JSON.stringify(user));
    }

    //create one hndle error method so that all methods can use it. 
    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        console.log(errorRes);
        if(!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
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
        return throwError(errorMessage);

    }
}