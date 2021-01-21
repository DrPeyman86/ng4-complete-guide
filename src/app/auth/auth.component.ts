import { Component, ComponentFactoryResolver, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})


export class AuthComponent implements OnInit, OnDestroy {
    isLoginMode = true;
    isLoading = false;
    error: string = null;
    authObs: Observable<AuthResponseData>;
    //you can pass in the type of a DOM element rather than the name of it inside of @ViewChild.
    //PlaceholderDirective is the type so @ViewChild will look for the first type of that DOM element in the DOm and use it
    //we store it in a local porperty alertHost
    @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
    private closeSub: Subscription;

    constructor(private authService: AuthService,
      private router: Router,
      private componentFactorResolver: ComponentFactoryResolver,
      private store: Store<fromApp.AppState>
      ) {}

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;//reverse the boolean
    }

    onSubmit(form: NgForm) {
        console.log(form.value);
        if(!form.valid){
            return;
        }
        const email = form.value.email
        const password = form.value.password



        this.isLoading = true;
        //instead of having 2 blocks of .subscribe, one for each method in the AuthService.
        //use a Observable property and set that observable so that you can subscribe to the observable.
        if(this.isLoginMode) {
            //this.authObs = this.authService.login(email, password)
            this.store.dispatch(
              new AuthActions.LoginStart({
                email: email,
                password: password
              })
            )
            // .subscribe((res:any)=>{
            //     console.log(res);
            //     this.isLoading = false;
            //     form.reset();
            // }, errorMessage => {
            //     console.log(errorMessage)
            //     this.error = errorMessage;
            //     this.isLoading = false;
            // })
        } else {
            this.authObs = this.authService.signup(email, password)
            // .subscribe((res:any)=>{
            //     console.log(res);
            //     this.isLoading = false;
            //     form.reset();
            // }, errorMessage => {
            //     console.log(errorMessage)
            //     this.error = errorMessage;
            //     this.isLoading = false;
            // })
        }

        //after using the Auth Effects Store, the following code block was commented
        /*
        this.authObs.subscribe((res:any)=>{
            console.log(res);
            this.isLoading = false;
            //routes can be either done in the Service or here. It depends on you.
            //if you want to keep the Service file clean of any client specific routing, view, etc. you could have the routing done here.
            //if you want to send some data to the next component that loads on whatever route you have, then maybe the service would be better.
            this.router.navigate(['/recipes']);//adding routes
            form.reset();
        }, errorMessage => {
            console.log(errorMessage)
            this.error = errorMessage;
            this.showErrorAlert(errorMessage);
            this.isLoading = false;
        })*/
    }

    onHandleError() {
        //all needed here is to reset the error back to null, so that no error exists on page. which would remove the app-alert selector since that
        //looks for if error exists.
        this.error = null;
    }

    //after adding Auth Effects. you should subscribe to the 'auth' state, which is an observable.
    ngOnInit() {
      this.store.select('auth').subscribe(authState=>{
        this.isLoading = authState.loading;//we added a property to the auth effects so that we would know when the app is loading or not.
        this.error = authState.authError;//we added a  property to auth effects so we would know the error that comes back from the auth.reducer.
        if(this.error) {
          this.showErrorAlert(this.error);
        }
      });
    }

    ngOnDestroy() {
        //added an if to check if we have an ACTIVE subscription open. If we do, unsubscribe() when we leave the page
        if (this.closeSub) {
            this.closeSub.unsubscribe();
        }
    }

    //create an alert by instantiating the alert component
    private showErrorAlert(message: string) {
        //the below line is a valid Typescript code and will not throw error, however it will not work with Angular.
        //Angular does more than just creating an object when Angular instantiates a component, it needs to compile it up to change detection into the DOM
        //This would be a normal Javascript object, but that is not what Angular needs.
        //const alertComp = new AlertComponent();

        //instead you need to let Angular create the Alert Component. Angular gives you a tool, the Angular Component Factory.
        //once you import the ComponentFactoryResolver in the constructor. You can then use it to build a component.
        //you pass in the Component as an argument and you do not need to instantiate it by the "new" keyword. You just tell it
        //where the component is which you want the componentFactory to create for you
        //the method will return a ComponentFactory type. So you can set it to a local variable.
        //The variable will not be the component itself, but the FACTORY. So this becomes an object that knows how to create alert
        //component. With the factory, you can create a concrete component, but for that, we need to palce where we can attach it in our
        //DOM. We need to tell Angular where we want to add this component.
        //ANgular needs a ViewContainerRef which is essentially an object managed internally by Angular, which gives Angular reference or a pointer
        //to a place in the DOM to which it can interact and this object has more than just like the coordinates where this component should sit in the DOM.
        //but it also has methods where the component can be created in the DOM
        //continue to the placeholder.directive.ts
        const alertCmpFactory = this.componentFactorResolver.resolveComponentFactory(AlertComponent)

        //the public .viewContainerRef comes from the placeHolderDirective host, which there we created a public viewContainerRef property
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        //clear any previous references that may have existed before
        //because viewContainerRef is not just a place where something should be display in the DOM, instead it is an object that allows you to interact with that
        //place in the DOM and clear simply clears all Angular components that have been rendered in that place before. So we want to clear everything before
        //we render something new
        hostViewContainerRef.clear();

        //now need the referene of the FACTORY of the component we want to create.
        // hostViewContainerRef.createComponent(alertCmpFactory);

        //now to adding message and close ability to the alertComponent. Need to create a reference of that component locally.
        const alertComponentRef = hostViewContainerRef.createComponent(alertCmpFactory);
        //now you can interact with the AlertComponent

        //instance property which gives you access to the concerete instance of this component that was created here and this instance should have the
        //properties defined in AlertComponent.
        //now you can simply set the property message of the AlertComponent to the error message we received here in this function above.
        alertComponentRef.instance.message = message;
        //since this is a component where it has an @Output() where it has an EventEmitted(), we want to manually Subscribe() to it. Which is an expection
        //where you would not otherwise be able to subscribe().
        this.closeSub = alertComponentRef.instance.close.subscribe(()=>{
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        });


    }


}
