import { Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Ingredient } from '../../shared/ingredients.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
//@ViewChild will allow you to listen to the local reference before an event is tiggered. you are referencing that element at any point of any event.
//name the alias of the viewChild to the local reference. And name them nameInputRef, which is of type ElementRef.
//V2 no longer need the @ViewChild s once you add the Tempalte driven form enhancement
// @ViewChild('nameInput') nameInputRef: ElementRef;
// @ViewChild('amountInput') amountInputRef: ElementRef;

//output ingredientAdded event that is of type eventEmitted, sending a generic type of Ingredient model
//section 10 - after adding services, you do not need to emit an event to the parent component for it to do something. you can emit an event to the service. that would add the new ingredient to the ingredient array,
//which will then pass it to the list ingrdient component.
//@Output() ingredientAdded = new EventEmitter<Ingredient>();

  @ViewChild('f') slForm: NgForm;

  IngEditsubscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit() {
    this.IngEditsubscription = this.shoppingListService.startedEditing
    .subscribe((index: number)=>{
      this.editMode = true;
      this.editedItemIndex = index;
      this.editedItem = this.shoppingListService.getIngredient(index);
      this.slForm.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount
      })
    })
  }

  ngOnDestroy() {
    this.IngEditsubscription.unsubscribe();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }

  onSubmitItem(form: NgForm) {
    /*
    //use const because they will not change and they will only be assigned one time.
    //this.nameInputRef is the reference of the nativeElement.value which is the nameInput local reference element. so nativeElement is the input element that has local reference of nameInput. this.nameInputRef is the reference of that element
    const ingName = this.nameInputRef.nativeElement.value;
    //this.nameInputRef is the reference of the nativeElement.value which is the nameInput local reference element. so nativeElement is the input element that has local reference of nameInput. this.nameInputRef is the reference of that element
    const intAmount = this.amountInputRef.nativeElement.value;
    //initiliaze a  new Ingredient() model by providing the necessary info to that class and store it in local const newIngredients
    const newIngredient = new Ingredient(ingName, intAmount);
    //send the newIngredient to the event called ingredientAdded
    //section 10 -- after adding service, do not emit event to the parent component. instead emit event to the service.
    //this.ingredientAdded.emit(newIngredient);
    this.shoppingListService.addIngredient(newIngredient);
    */

    //V2 - once adding TD approach to the form do following instead of above. 
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient)
    } else {
      this.shoppingListService.addIngredient(newIngredient);
    }
    this.editMode = false;
    form.reset();
    

  }

}
