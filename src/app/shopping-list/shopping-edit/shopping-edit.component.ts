import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter} from '@angular/core';
import { Ingredient } from '../../shared/ingredients.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
//@ViewChild will allow you to listen to the local reference before an event is tiggered. you are referencing that element at any point of any event.
//name the alias of the viewChild to the local reference. And name them nameInputRef, which is of type ElementRef.
@ViewChild('nameInput') nameInputRef: ElementRef;
@ViewChild('amountInput') amountInputRef: ElementRef;
//output ingredientAdded event that is of type eventEmitted, sending a generic type of Ingredient model
@Output() ingredientAdded = new EventEmitter<Ingredient>();

  constructor() { }

  ngOnInit() {
  }

  onAddItem() {
    //use const because they will not change and they will only be assigned one time.
    //this.nameInputRef is the reference of the nativeElement.value which is the nameInput local reference element. so nativeElement is the input element that has local reference of nameInput. this.nameInputRef is the reference of that element
    const ingName = this.nameInputRef.nativeElement.value;
    //this.nameInputRef is the reference of the nativeElement.value which is the nameInput local reference element. so nativeElement is the input element that has local reference of nameInput. this.nameInputRef is the reference of that element
    const intAmount = this.amountInputRef.nativeElement.value;
    //initiliaze a  new Ingredient() model by providing the necessary info to that class and store it in local const newIngredients
    const newIngredient = new Ingredient(ingName, intAmount);
    //send the newIngredient to the event called ingredientAdded
    this.ingredientAdded.emit(newIngredient);
  }

}
