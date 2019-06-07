import { Component, OnInit, Input} from '@angular/core';

import { Recipe } from '../../recipes.model';
import { RecipeService } from '../../recipe.service';


@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {
  //@input() means this component is getting a property from a property binding from this component's parent. 
  @Input() recipe: Recipe;
  @Input() index: number;

  //the event will have not arguments passed along, so you put void
  //@Output() recipeSelected = new EventEmitter<void>();//once you add this component as a children to the recipe.component parent, you do not need this anymore. 

  constructor(
    //private recipeService: RecipeService//once you add this component as a children to the recipe.component parent, you do not need this anymore. 
  ) { }

  ngOnInit() {
  }

  //once you add this component as a children to the recipe.component parent, you do not need this anymore. 
  /*
  onSelected() {
    //method called when the link element is clicked. Trigger an event called recipeSelected for the parent component of this component will listen to. Parent component is recipe-list.component. go there to see this event being listened to
    //this.recipeSelected.emit();
    //section 10 adding services
    this.recipeService.recipeSelected.emit(this.recipe);//use the service to emit an event instead of emitting an event from this component back to the parent component.
  }*/

}
