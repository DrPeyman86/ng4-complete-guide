import { Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Ingredient } from '../../shared/ingredients.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

//import everything from the shopping-list-reducer. 
//it is a naming convention to use "from" in front of it to signify that it is "from" a store or state. 
import * as fromShoppingList from '../store/shopping-list.reducer';

import * as ShoppingListActions from '../store/shopping-list.actions';

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

  @ViewChild('f', {static:true}) slForm: NgForm;

  IngEditsubscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(
    private shoppingListService: ShoppingListService
    // , private store: Store<{ShoppingList: {ingredients: Ingredient[]}}>
    //
    , private store: Store<fromShoppingList.AppState>
    ) {}

  ngOnInit() {
    //console.log('here');
    
    // this.IngEditsubscription = this.shoppingListService.startedEditing
    // .subscribe((index: number)=>{
    //   this.editMode = true;
    //   this.editedItemIndex = index;
    //   //console.log(this.editedItemIndex)
    //   this.editedItem = this.shoppingListService.getIngredient(index);
    //   //console.log(this.editedItem);
    //   this.slForm.setValue({
    //     name: this.editedItem.name,
    //     amount: this.editedItem.amount
    //   })
    // })
    //once you start using the Store you can comment out the entire block code above with below. 
    //you can .subscribe() to the store.select('ShoppingList') observable. 
    this.IngEditsubscription = this.store.select('ShoppingList').subscribe(stateData=>{
      //check to make sure the editedIngredientIndex is greater than -1 because -1 is the initial state value and it does not 
      //define an edit mode. so if it is -1, then edit mode would be false. 
      if(stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;

        //you don't need to store the index here anymore since the store already knows the index of the ingredient we are editing. 
        //this.editedItemIndex = stateData.editedIngredientIndex;
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      } else {
        this.editMode = false;
      }
    })
  }

  ngOnDestroy() {
    //console.log('here11')
    this.IngEditsubscription.unsubscribe();
    //after adding the Store edit, we want to dispatch an action to the store just so it stops editing of the store.
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
    //after adding the Store edit, we want to dispatch an action to the store just so it stops editing of the store.
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    //once you add the "Store" you can comment the line below to remove the service from being used. 
    // this.shoppingListService.deleteIngredient(this.editedItemIndex);
    //once you remove redundant code, you can remove the index of the item you are trying to delete as part of the payload because the index is managed by the store itself. 
    // this.store.dispatch(new ShoppingListActions.DeleteIngredient(this.editedItemIndex))
    this.store.dispatch(new ShoppingListActions.DeleteIngredient())
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
      //once you add the "Store" you can comment the line below to remove the service from being used. 
      // this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient)
      // this.store.dispatch(new ShoppingListActions.UpdateIngredient({
      //   index: this.editedItemIndex, 
      //   ingredient: newIngredient
      // }))

      //once you start using the Store and editing it that way, you don't need the index to be passed onto the UpgradeIngreint() action anymore because the store already knows 
        //the index of the ingredient we are editing. so it's redundant. 
        //index: this.editedItemIndex, 
        //replace code above. 
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient))
    } else {
      //after adding the Store method. comment line below
      //no longer will use the regular shoppinglistservice to addIngredient
      //this.shoppingListService.addIngredient(newIngredient);

      //new store method
      //need to add the ShoppingListActions ts file to be able access the different classes which are different action items
      //we need a way to send the payload to the class's constructor. for that, you need to add a constructor to the class, which would accept a payload argument. 
      //go to shopping-list.actions.ts now in the AddIngredient and see constructor function. That payload argument, made it possible to send the entire object 
      //as the payload to that AddIngredient class. 
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient))
    }
    this.editMode = false;
    form.reset();
    

  }

}
