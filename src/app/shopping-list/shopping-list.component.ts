import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredients.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';

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
  Ingredients: Ingredient[];
  private IngredientsSubscription: Subscription;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit() {
    this.Ingredients = this.shoppingListService.getIngredients();
    //section 10 - adding service. once you add an event trigger on the service, you can subscribe to the event name. so that everytime the event name is triggered, this subscribe block will
    //run adding a new Ingredient of type Ingredient[], which will then add that ingredient to this component's Ingredients array.
    this.IngredientsSubscription = this.shoppingListService.ingredientChanged
    .subscribe(
      (Ingredients: Ingredient[])=>{
        this.Ingredients = Ingredients;
      }
    )
  }

  ngOnDestroy() {
    this.IngredientsSubscription.unsubscribe();
  }

  //section 10 -- adding service. do not need to push to array here. instead use service.
  // onIngredientAdded(ingredient: Ingredient) {
  //   this.Ingredients.push(ingredient);
  // }


}
