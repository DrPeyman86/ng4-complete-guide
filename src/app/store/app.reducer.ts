//store global store to manage the entire AppState rather before AppState was being stored in the shopping-list-reducer, because at the time
//it was the first store created. But after adding more Stores, it makes sense to have a global store to manage some AppStates
import { ActionReducerMap } from '@ngrx/store';

import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../auth/store/auth.reducer';


//you are defining the global AppState by defining Sub-states of every inidividual state that makes up the global/App State.
export interface AppState {
  shoppingList: fromShoppingList.State;
  auth: fromAuth.State;
}

//the ActionReducerMap is a generic type. so you need to define what type will be returned
//from the appReducer function. Which of course is the AppState.
export const appReducer: ActionReducerMap<AppState> = {
  shoppingList: fromShoppingList.shoppingListReducer,
  auth: fromAuth.authReducer
};
