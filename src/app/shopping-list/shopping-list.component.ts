import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredients.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription, Observable } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Store } from '@ngrx/store';

//import everything from the shopping-list-reducer. 
//it is a naming convention to use "from" in front of it to signify that it is "from" a store or state. 
import * as fromShoppingList from './store/shopping-list.reducer';

import * as ShoppingListActions from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  //define an ingredient of the type of ingredient from the ingredient model
  //section 10 - adding services. this would be defined in service.
  // Ingredients: Ingredient[] = [
  //   new Ingredient('Apple', 5),
  //   new Ingredient('Broccolli', 2),
  // ];
  //Ingredients: Ingredient[];
  //the line above replaced with line below. which the type matches with what the store will return. it will be an observable first
  //then it will include an object, which would have a key name of ingredients, and that value would be an array of Ingredient model.
  ingredients: Observable<{ingredients: Ingredient[]}> 
  private IngredientsSubscription: Subscription;

  constructor(
    private shoppingListService: ShoppingListService
    , private logginService: LoggingService
    //look in ngRx.doc file in dropbox to learn more
    //the key name has to match with app.module.ts where you defined the AppReducerMap.
    // , private store: Store<{ShoppingList: {ingredients: Ingredient[]}}>
    //
    , private store: Store<fromShoppingList.AppState>
    ) {}

  ngOnInit() {
    //the select() method slices the object, meaning it creates a new object from the object defined as argument. 
    //the shoppingList argument should pop up as an option because you defined it up in the constructor generic type. 
    //you need to make sure this.Ingredients is of type the same as wha     
   //the store.select() will return. the store.select() will return an object, which has a key of ingredients, which includes as an array of 
    //ingredient array. So this.Ingredients needs to be same thing. 
    //this.store.select() returns an observable, so the this.Ingredients needs to be an observable also. 
    this.ingredients = this.store.select('ShoppingList')
    //console.log(this.ingredients)
    //the following lines commented out once we started using store 
    // this.ingredients = this.shoppingListService.getIngredients();
    // //section 10 - adding service. once you add an event trigger on the service, you can subscribe to the event name. so that everytime the event name is triggered, this subscribe block will
    // //run adding a new Ingredient of type Ingredient[], which will then add that ingredient to this component's Ingredients array.
    // this.IngredientsSubscription = this.shoppingListService.ingredientsChanged
    // .subscribe(
    //   (ingredients: Ingredient[])=>{
    //     //console.log(ingredients)
    //     this.Ingredients = ingredients;
    //   }
    // )
    this.logginService.printLog('Hello from shipping list component');
  }

  ngOnDestroy() {
    //console.log('here');
    //this.IngredientsSubscription.unsubscribe();
  }

  onEditItem(index: number) {
    //console.log(index);
    // this.shoppingListService.startedEditing.next(index);
    //once you start using the Store Editing ability, replace line above with below. That would eliminate the need of that service. 
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  //section 10 -- adding service. do not need to push to array here. instead use service.
  onIngredientAdded(ingredient: Ingredient) {
    //this.Ingredients.push(ingredient);
  }


}
