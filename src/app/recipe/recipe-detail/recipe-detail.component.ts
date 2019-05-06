import { Component, OnInit, Input } from '@angular/core';

import { Recipe } from '../recipes.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  @Input() recipe: Recipe;

  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
  }

  //section 10 - passing values from one component's service to another component's service.
  //step 1 would be this. where you run the function that clicked the button on html to go the shopping-list.component.
  onAddToShoppingList() {
    //call a method inside this component's service and pass the ingredients of the recipe to it.
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }


}
