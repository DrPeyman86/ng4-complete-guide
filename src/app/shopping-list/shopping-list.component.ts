import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredients.model'

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  //define an ingredient of the type of ingredient from the ingredient model
  Ingredients: Ingredient[] = [
    new Ingredient('Apple',5),
    new Ingredient('Broccolli',2),
  ];
  constructor() { }

  ngOnInit() {
  }

}
