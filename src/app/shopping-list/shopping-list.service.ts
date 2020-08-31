import { Ingredient } from '../shared/ingredients.model';
import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({providedIn: 'root'})

export class ShoppingListService {
  //ingredientChanged = new EventEmitter<Ingredient[]>();
  //after adding Subject 
  ingredientsChanged = new Subject<Ingredient[]>();
  //create a new Subject to listen to when editing. 
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [
   new Ingredient('Apple', 5),
   new Ingredient('Broccolli', 2),
  ];

  getIngredients() {
    return this.ingredients.slice();//return a copy of the Ingredients array so that you do not send the exact object outside this service.
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    //you need to emit an event here so that this service will be informed of something has changed with one of its properties "ingredients". Otherwise it will not send any updates to any other
    //component that relies on this service to provide its data to them.
    //this.ingredientChanged.emit(this.ingredients.slice());//create an event up top, and emit an event with the new ingredients array but of copy.
    
    //after adding Subject
    this.ingredientsChanged.next(this.ingredients.slice());
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
    //this.ingredients.push(...ingredients);
    this.ingredients = [...ingredients];
    //this.ingredientChanged.emit(this.ingredients.slice());//once the new ingredients are added to the array, inform the service of the change by emitting and passing a copy of the new array.

    //after adding Subject
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    //update the index of that array to the new Ingredient passed from shopping-edit-component. 
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(index:number) {
    //slice will remove 1 length of whatever index you give it. 1 is just saying delete 1 index after the index provided in the first argument. 
    //so if you are deleteing element that has index of 3. So 3 would be passed into index. That's the starting point of that array, and then it would go up 1 length so it would essentially remove that 3rd index.
    this.ingredients.splice(index,1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

}
