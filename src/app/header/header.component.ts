import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  //not need after you add routes
  // @Output() featureSelected = new EventEmitter<string>();//create an objected based on the eventEmitted class
  userSub: Subscription;
  isAuthenticated = false;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
    ) { }

  ngOnInit() {
    //after adding the Auth Store and using it replace line above with following.
    // this.userSub = this.authService.user.subscribe(user=>{
    //here again the auth select from the store returns an object of the auth state, so you need to .pipe() and map() to extract the user from that object
    //which returns an observable still, so it can be subscribed to normally
    this.userSub = this.store.select('auth').pipe(map(authState=>authState.user)).subscribe(user=>{
      //console.log(!user);
      //console.log(!!user);
      //
      //this.isAuthenticated = !user ? false : true;
      //the follwing line is same as line above, just shorter.
      this.isAuthenticated = !!user;
      //this !!user is a shorter version of checking if (!user) which returns false, if the user is not authenticated. so the extra ! in front of !user, would just set to false.
      //if user is logged in authenticated, then !user would be true. the ! would send the IF statement to the ": true;" block, so it becomes true;. so this.isAuthenticated becomes true.
    });
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  //not need after you add routes
  // onSelect(feature: string) {
  //   this.featureSelected.emit(feature);
  // }

}
