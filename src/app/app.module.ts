import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
// import { ShoppingListComponent } from './shopping-list/shopping-list.component';
// import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';
// import { DropdownDirective } from './shared/dropdown.directive'
// import { ShoppingListService } from './shopping-list/shopping-list.service';
import { AppRoutingModule } from './app-routing.module';
// import { RecipeService } from './recipe/recipe.service';
import { AuthComponent } from './auth/auth.component';
// import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
// import { AuthInterceptorService } from './auth/auth.interceptor.service';
// import { AlertComponent } from './shared/alert/alert.component';
// import { PlaceholderDirective } from './shared/placeholder/placeholder.directive';
//import { RecipesModule } from './recipe/recipes.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import { LoggingService } from './logging.service';
import { shoppingListReducer } from './shopping-list/store/shopping-list.reducer';
import { authReducer } from './auth/store/auth.reducer';
import * as fromApp from './store/app.reducer';

//adding AuthEffects
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth/store/auth.effects';

//import { AuthModule } from './auth/auth.module';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    // ShoppingListComponent,
    // ShoppingEditComponent,
    //DropdownDirective,
    AuthComponent,
    //LoadingSpinnerComponent,
    //AlertComponent,
    //PlaceholderDirective
  ],
  imports: [
    CommonModule,
    BrowserModule,//the browser module should only be loaded once in the app.module. Any other module, use the CommonModule as it is smaller in size
    FormsModule,
    // ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    //RecipesModule,
    ShoppingListModule,
    //AuthModule,
    //once you add the app.reducer.ts file, you would just import everything from that reducer function into here. more cleaner to manage your stores in one file.
    // StoreModule.forRoot({
    //   ShoppingList: shoppingListReducer,
    //   auth: authReducer
    // }),
    //replace above with this.
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([AuthEffects]),
    SharedModule,
    CoreModule
  ],
  // providers: [
  //   ShoppingListService,
  //   RecipeService,
  //   {provide: HTTP_INTERCEPTORS,
  //     useClass: AuthInterceptorService,
  //     multi: true
  //   }
  // ],
  //the bootstrap component is the root component starting component. you could have other starting components
  bootstrap: [AppComponent],
  //entryComponents are components that should be loaded with Angular when Angular loads.
  //typically components when Declared throughout the application are either instantiated by a selector or when they are designated as the component
  //when clicking on a path/routing. Since the AlertComponent is now created by programmatically calling that component, it never has neither of the 2 traditional
  //methods of instantiating components. So the entryComponents array you can declare components that should be loaded at point of entry
  // entryComponents: [
  //   AlertComponent
  // ]
  // providers: [LoggingService]
})
export class AppModule { }
