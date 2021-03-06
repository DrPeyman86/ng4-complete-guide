import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipes.model';
import { RecipeService } from './recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
  //providers: [RecipeService]
})
export class RecipeComponent implements OnInit {
  selectedRecipe: Recipe;

  //since this is the parent component of the Recipe list and recipe detail components, the same instance of the recipeService will be used
  //throughout the 2 components. That's important because if they were not using the same instance of the same service, then if one emits an event from the service, the other recipe component
  //could not listen to that event.
  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    //we can listen to that eventEmitter in the servic everytime it is triggered so that this main parent compoent will subscribe() to it, which it expects a Recipe type value,
    //and it will set ths selectedRecipe to that recipe.

    //you actually do not need this anymore before previously we were emitting an event to select from a list of recipes which is subscribed to here from the service. 
    //but since in recipe-item with the add of [RouterLink] where we use the router to pass in the id of the recipe to the RecipeDetailComponent, you do not need any subjects at all now. 
    //so code can be commented. 
    // this.recipeService.recipeSelected
    // .subscribe(
    //   (recipe: Recipe)=>{
    //     this.selectedRecipe = recipe;
    //   }
    // )
  }



}
