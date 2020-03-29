import { Recipe } from './recipes.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredients.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()//you could use this sytax to make this service available in the root directory level of the app so that all compoents can utlize this service
//rather than providing this service in the "providers" array of the component you want this service. It would either be app.module.ts "providers" or see recipe.component.ts where it
//has "providers" array which makes this service available to only child services under recipse.component.ts and not the whole app. the @Injectable approach is much better because services can be loaded lazily
//and redundant code can be removed automatically. this leads to better performance especially for bigger apps.
export class RecipeService {
  //recipeSelected = new EventEmitter<Recipe>();//create an eventEmitter which would be of type Recipe.

  //after adding Subject
  //recipeSelected = new Subject<Recipe>();
  recipeChanged = new Subject<Recipe[]>();

  //make private so only this class can modify recipe array
  private recipes: Recipe[] = [];
  // private recipes: Recipe[] = [
  //   new Recipe('this is a new recipe','new recipe description','https://upload.wikimedia.org/wikipedia/commons/8/87/Ranch_Steak_Sandwich_at_Val%27s_%28744707629%29.jpg'
  //   , [
  //     new Ingredient('Meant', 1),
  //     new Ingredient('French Fries', 20)
  //   ]),
  //   new Recipe('second recipe','second recipe desc','https://upload.wikimedia.org/wikipedia/commons/8/87/Ranch_Steak_Sandwich_at_Val%27s_%28744707629%29.jpg'
  //   , [
  //     new Ingredient('Buns', 2),
  //     new Ingredient('Meant', 2)
  //   ])
  // ];//recipes is a type of the Recipe model. And it's an array model
  //pass the Recipe model to the recipeWasSelected event because recipe-details.com

  //step 4 -- add the other component's you are passing the array to the constructor.
  constructor(private shoppingListService: ShoppingListService){}

  //once you add HTTP into the application, need a way to basically overwrite current local recipes with what is in the database. 
  //setRecipes gets called from data-storage.service.ts when we click "Fetch Recipes"
  setRecipes(recipes: Recipe[]){
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice())//since the recipes changed and we have observable, use the next() to emit an event, which will then trigger a change method on every component that is subscribing to the recipeChanged subject.
    //and pass in a COPY version of the recipes array be using slice(). 
  }

  getRecipes() {
    return this.recipes.slice();//don't return the array itself since arrays are reference types and this would return the direct reference to this array. slice() will return a new array which will copy the exact array.
  }

  //after we add children routing, we need a way of selecting a single recipe to be used for the recipe-detail.component. So need to implement below method. 
  getRecipe(index: number) {
    return this.recipes.slice()[index];//you could use .slice() to copy a new array of the recipes array and send that instead of copying the referenced type array recipes. 
  }

  //step 2 -- you would get the array of Ingredients here.
  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    //step 3 - inject the shoppingListService by using the @Injectable() in this service. since the @INjectable() root was already used here in this service, it will work.
    //console.log(ingredients);
    this.shoppingListService.addIngredients(ingredients);
  }
  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);//on new recipe, push the new Recipe to the recipes array
    this.recipeChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;//change the index of the current recipes array to whatever was passed in as the newRecipe 
    this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index,1)
    this.recipeChanged.next(this.recipes.slice());
  }

}
