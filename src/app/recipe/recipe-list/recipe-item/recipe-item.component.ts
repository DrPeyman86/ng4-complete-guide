import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import { Recipe } from '../../recipes.model';


@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {
  @Input() recipe: Recipe;
  //the event will have not arguments passed along, so you put void
  @Output() recipeSelected = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  onSelected() {
    //method called when the link element is clicked. Trigger an event called recipeSelected for the parent component of this component will listen to. Parent component is recipe-list.component. go there to see this event being listened to
    this.recipeSelected.emit();
  }

}
