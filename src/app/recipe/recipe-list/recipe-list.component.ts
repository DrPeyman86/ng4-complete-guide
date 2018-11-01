import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipes.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe('this is a new recipe','new recipe description','https://upload.wikimedia.org/wikipedia/commons/8/87/Ranch_Steak_Sandwich_at_Val%27s_%28744707629%29.jpg'),
    new Recipe('second recipe','second recipe desc','https://upload.wikimedia.org/wikipedia/commons/8/87/Ranch_Steak_Sandwich_at_Val%27s_%28744707629%29.jpg')
  ];//recipes is a type of the Recipe model. And it's an array model

  constructor() { }

  ngOnInit() {
  }

}
