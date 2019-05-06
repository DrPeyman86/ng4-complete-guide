import { Component, OnInit/*, EventEmitter, Output */} from '@angular/core';
import { Recipe } from '../recipes.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  //section 10 on course removed stuff from here to services.
  // recipes: Recipe[] = [
  //   new Recipe('this is a new recipe','new recipe description','https://upload.wikimedia.org/wikipedia/commons/8/87/Ranch_Steak_Sandwich_at_Val%27s_%28744707629%29.jpg'),
  //   new Recipe('second recipe','second recipe desc','https://upload.wikimedia.org/wikipedia/commons/8/87/Ranch_Steak_Sandwich_at_Val%27s_%28744707629%29.jpg')
  // ];//recipes is a type of the Recipe model. And it's an array model
  // //pass the Recipe model to the recipeWasSelected event because recipe-details.component will ultimately need the recipe
  recipes: Recipe[];
  //section 10 since adding services, do not need to eventEmitter anymore in this component.
  //@Output() recipeWasSelected = new EventEmitter<Recipe>();

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.recipes = this.recipeService.getRecipes();
  }

  //section 10. you do not need this method anymore since we added a service
  // onRecipeSelected(recipe: Recipe) {
  //   //when the onRecipeSelected is executed, trigger an event called recipeWasSelected and send the recipe in iteration to the parent component. Parent component is recipe.component.html, go there to follow
  //   this.recipeWasSelected.emit(recipe);
  // }

}
