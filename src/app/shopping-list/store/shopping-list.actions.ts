import { Action } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredients.model';


//this Actions file is good practice to standardize your action string values. you map the string value of the action to a constant
//so that the app won't break in the reducer function since you wouldn't be trying to match the string value to exactly what is the value in the reducer function
//instead having the Actions.ts file, you would know in case your actions do not work correctly, that you need to match the string value here.
//these identifiers must be unique through the application. because ACTIONS that are dispatched reach all reducers in an application, so if you have
//the same identifier across several actions.ts files, even though you may have wanted an action from the shopping-list.actions.ts, if you have an identifier here
//that matches one in auth.actions.ts, the auth.actions.ts will also handle that action. So in NgRx world, there format for naming your identifiers is puuting
//[] and naming what the name of the reducer is. [Shopping List]
export const ADD_INGREDIENT = '[Shopping List] Add Ingredient';
export const ADD_INGREDIENTS = '[Shopping List] Add Ingredients';//this is different then above. This runs when you click on a Recipe and it runs all ingredients for that one recipe.
export const UPDATE_INGREDIENT = '[Shopping List] Update Ingredient';
export const DELETE_INGREDIENT = '[Shopping List] Delete Ingredient';
export const START_EDIT = '[Shopping List] Start Edit';
export const STOP_EDIT = '[Shopping List] Stop Edit';

//export another class that describes our action
//that is the Action itself.
//the Action is an object which needs to have a TYPE property. it is not a string.
//Action is an object and objects can be created based on classes. the class should have a descriptive name
//clasa names should be Pascal CASE.
//the AddIngredients class implements the Action interface, same as if you had imported the Action in the reducer function file.
//implementing the Action interface, forces us to add the class in a certain way. It now needs to have what the Action object
//requires inside the reducer.ts file, which is the "type" property for one.
export class AddIngredient implements Action {
    //the type is the IDENTIFIER of the action.
    //this will always be the Add ingredient action since this is the class we are in, so you can just set the type to the ADD_INGREDIENT
    //you put readonly syntax in front of the type whic is a typescript keyword, meaning that this value should never be update from outside of this class.
    readonly type = ADD_INGREDIENT;
    //the payload in an optional proeprty. the only thing that is required is the type.

    //after you add a constructor with the payload public, which makes it both a property this class and an argument that you can send to this class when you .dispatch() actions.
    //you can then comment this next line.
    // payload: Ingredient;

    //add constructor so that you can send arguments to this class when you dispatch actions.
    constructor(public payload: Ingredient){}
}

//this class is for ADD_INGREDIENTS.
export class AddIngredients implements Action {
    readonly type = ADD_INGREDIENTS;

    //the constructor will handle an array of Ingredient. Because one recipe can have many ingredients
    constructor(public payload: Ingredient[]){}
}

//this class is to UpdateIngredient
export class UpdateIngredient implements Action {
    readonly type = UPDATE_INGREDIENT;

    //the payload of the update ingredients is an object. Look at the shopping-list.service.ts file for the updateIngredient,
    //it requires the index of the item you are trying to update. ANd also the ingredient itself.
    //so make sure the type is correct here and matches with what you had in your service before.
    //the index sent through the payload is redundant. because after adding the editedIngreidnetIndex to the State's type in the reducer.ts file.
    //we already know what ingredient based on that index we are editing, so no need to send it in.
    // constructor(public payload: {index: number, ingredient: Ingredient}){}
    //so remove the index.
    constructor(public payload: Ingredient){}
}

//the deleteIngredient as the payload just requires the index number of what ingredient you want to remove.
export class DeleteIngredient implements Action {
    readonly type = DELETE_INGREDIENT;

    //the index sent through the payload is redundant. because after adding the editedIngreidnetIndex to the State's type in the reducer.ts file.
    //we already know what ingredient based on that index we are editing, so no need to send it in.
    // constructor(public payload: number){}
    constructor(){}
}

export class StartEdit implements Action {
    readonly type = START_EDIT;

    constructor(public payload: number) {}
}

export class StopEdit implements Action {
    readonly type = STOP_EDIT;
}


//export thie TYPE so that the reducer function will be able to handle both and many classes defined here. Seperated by the PIPE operator.
//add any new class type to this Actions union type so that in your reducer function, the reducer would know of these different types.
export type ShoppingListActions = AddIngredient | AddIngredients | UpdateIngredient | DeleteIngredient | StartEdit | StopEdit;
