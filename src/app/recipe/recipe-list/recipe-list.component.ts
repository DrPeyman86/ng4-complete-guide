import { Component, OnInit,/*, EventEmitter, Output */
Output,
OnDestroy} from '@angular/core';
import { Recipe } from '../recipes.model';
import { RecipeService } from '../recipe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  //section 10 on course removed stuff from here to services.
  // recipes: Recipe[] = [
  //   new Recipe('this is a new recipe','new recipe description','https://upload.wikimedia.org/wikipedia/commons/8/87/Ranch_Steak_Sandwich_at_Val%27s_%28744707629%29.jpg'),
  //   new Recipe('second recipe','second recipe desc','https://upload.wikimedia.org/wikipedia/commons/8/87/Ranch_Steak_Sandwich_at_Val%27s_%28744707629%29.jpg')
  // ];//recipes is a type of the Recipe model. And it's an array model
  // //pass the Recipe model to the recipeWasSelected event because recipe-details.component will ultimately need the recipe
  recipes: Recipe[];
  subscription: Subscription;
  @Output() index: number;
  //section 10 since adding services, do not need to eventEmitter anymore in this component.
  //@Output() recipeWasSelected = new EventEmitter<Recipe>();

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    //get the array of all recipes by calling the service when on load. this would be the first step in getting recipes. Got to this component's html for next step.
    this.recipes = this.recipeService.getRecipes();

    this.subscription = this.recipeService.recipeChanged
    .subscribe((recipes: Recipe[])=>{
      this.recipes = recipes;
    })
  }

  onNewRecipe() {
    //add route: ActivatedRoute to inform angular of the path we are on now, so that when we click and navigate to /new. it adds a /new to the URL relative to the activatedRoute we are on now. 
    this.router.navigate(['new'], {relativeTo: this.route})
  }
  //section 10. you do not need this method anymore since we added a service
  // onRecipeSelected(recipe: Recipe) {
  //   //when the onRecipeSelected is executed, trigger an event called recipeWasSelected and send the recipe in iteration to the parent component. Parent component is recipe.component.html, go there to follow
  //   this.recipeWasSelected.emit(recipe);
  // }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
