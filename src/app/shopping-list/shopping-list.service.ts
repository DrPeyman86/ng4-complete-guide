import { Ingredient } from '../shared/ingredients.model';
import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({providedIn: 'root'})

export class ShoppingListService {
  //ingredientChanged = new EventEmitter<Ingredient[]>();
  //after adding Subject 
  ingredientChanged = new Subject<Ingredient[]>();

  private ingredients: Ingredient[] = [
   // new Ingredient('Apple', 5),
    //new Ingredient('Broccolli', 2),
  ];

  getIngredients() {
    return this.ingredients.slice();//return a copy of the Ingredients array so that you do not send the exact object outside this service.
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    //you need to emit an event here so that this service will be informed of something has changed with one of its properties "ingredients". Otherwise it will not send any updates to any other
    //component that relies on this service to provide its data to them.
    //this.ingredientChanged.emit(this.ingredients.slice());//create an event up top, and emit an event with the new ingredients array but of copy.
    
    //after adding Subject
    this.ingredientChanged.next(this.ingredients.slice());
  }

  //step 5 -- this function gets called from the recipse.service.ts when new ingredients are added to this service and ultimately component.
  addIngredients(ingredients: Ingredient[]) {
    //option 1
    //you could use a for loop to add ingredients to this service or ultimately the shopping list component ingredients array. but you would be emitting lot of new events
    //this is not bad, but there is a better way.
    // for (let ingredient of ingredients) {
    //   this.addIngredient(ingredient);
    // }
    //optin
    //step 6 -- add the new array using the spread operator. The spread operator allows you to turn an array of elements into a list of elements. the push() method can handle multiple objects .push(1,2,4,)
    //but it cannot handle an array. if you put an array inside of .push() it will simply add that array as an object into the other array. so by using the spread operator you can spread the ingredients into a
    //a list of of single ingredients which are pushed without issues of the ingredients array.
    this.ingredients.push(...ingredients);
    //this.ingredientChanged.emit(this.ingredients.slice());//once the new ingredients are added to the array, inform the service of the change by emitting and passing a copy of the new array.

    //after adding Subject
    this.ingredientChanged.next(this.ingredients.slice());
  }

}
