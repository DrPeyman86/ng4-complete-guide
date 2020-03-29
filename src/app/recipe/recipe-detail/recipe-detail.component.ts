import { Component, OnInit, Input } from '@angular/core';

import { Recipe } from '../recipes.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  //@Input() recipe: Recipe;//after adding routing to this children component do not need anymore. 
  id: number;
  recipe: Recipe;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    //const id = this.route.snapshot.params["id"];//this approach only works once when component loads initially. Because the recipe-list component is still loaded next to the recipe-details. so when you click 
    //on a new recipe-list item to select from, the "id" changes. SO you need a way to react to that change when the component is already loaded. So the above approach won't work for that. use subscription. 
    //this will allow you to listen to changes when component is already loaded. 
    this.route.params
      .subscribe(
        (params: Params)=> {
          this.id = +params["id"]
          //now need a way of fetching what recipe we are on. so use the service. 
          this.recipe = this.recipeService.getRecipe(this.id);
        }
      )
  }

  OnEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route});//this is exactly the same as below. but more simplified. 
    this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});//this shows a more complex where you are deliberately going back one level and adding the :id and then edit at the end of it
  }

  //section 10 - passing values from one component's service to another component's service.
  //step 1 would be this. where you run the function that clicked the button on html to go the shopping-list.component.
  onAddToShoppingList() {
    //call a method inside this component's service and pass the ingredients of the recipe to it.
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);//after adding routing to this children component do not need anymore. 
    this.router.navigate(['shopping-list'])
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes'])
  }


}