import { Ingredient } from "../../shared/ingredients.model";
//import { Action } from "@ngrx/store";
//import { ADD_INGREDIENT } from './shopping-list.actions';
//replace the line above with this to import everything rather than just importing one thig at a time. 
import * as ShoppingListActions from './shopping-list.actions';

//export an applicaiton-wide state which defines all Stores' States. So when you have a store for Recipe store, that would go here too. 
export interface AppState {
    ShoppingList: State;
}

//export an interface of the shopping-list state, so that in every component that you are using this state, you don't have to keep modifying it if you make 
//changes to the default initial state. 
export interface State {
    ingredients: Ingredient[],
    editedIngredient: Ingredient,
    editedIngredientIndex: number,
}


//optional if you want some initial state for the service you are trying to replace. 
//in shopping list service, we initialed with ingredients array. so here we can do same thing
const initialState: State = {
    ingredients: [
        new Ingredient('Apple', 5),
        new Ingredient('Broccolli', 2),
    ],
    //for editing ingredients, we need new properties for the state we are in. 
    editedIngredient: null,
    editedIngredientIndex: -1//use -1 as the initial states default value because 0 would technically be a valid index. -1 is not.
}
//once you add the ShoppingLIstActions import above, the (action: Action) argument inside the function would be replaced by 
//shoppingLIst.AddIngredient class as that class already implements the Action interface, so you don't need to import the Action interface here as well. 
export function shoppingListReducer(
        state: State = initialState, 
        // action: ShoppingListActions.AddIngredient
        //once you have added the UNION type in the actions.ts file. you would replace line above with bottom
        action: ShoppingListActions.ShoppingListActions//the first is just the Alias of what we imported here in this file. The second ShoppingLIstActions is the union type defined in actions.ts
    ) {
    //run logic based on the Action.type. 
    //the Action type interface from @ngrx/store forces certain properties on the action argument, which one of them is the "type" which we can check. 
    switch(action.type) {
        //the convention is all CAPS. to make it clear what the action is
        //once you add the import everything line above, you would put ShoppingListActions in front of the property. 
        case ShoppingListActions.ADD_INGREDIENT:
            //you can't use the following code. It's forbidden and bad practice to push the current state as the new state. 
            //it's bad practice. State changes with NgRx ALWAYS have to be immutable. 
            //state.ingredients.push()    
            return {
                //rule of thumb, always copy the old state and then also return the new state. 
                ...state,//spread operator. it pulls out all properties of the current/old state which will be copied by the spread operator
                //ingredients or whatever the name of the property is for that service you are wanting to replace with this NgRx reducer funcion. it has to be an array
                ingredients: [
                    //you still want the old ingredients state sent again. 
                    ...state.ingredients,
                    //the action will be the new state
                    //once you add the shopping-list.actions.ts file, and also include a payload property to that class, your action argument of type of that class in the actions.ts
                    //now has the payload property we can include here. 
                    action.payload
                ]
            }
        //initially when you wrote ShoppingLIstActions.ADD_INGREDIENTS, you had TS error. 
        //initially, TS error would be like type "ADD_INGREIDENTS" is not comparable to type "ADD_INGREDIENT"
        //the problem is your action: ShoppingLIstActions.AddIngredient argument is only aware of that one class being exported from the shopping-list.acitons.ts as a class.
        //now that there are more than 1 actions the reducer can't tell whether the action that reaches this reducer is actually the AddIngredient or the AddIngredients action.
        // The reducer function
        //here does not have support of the type of ADD_INGREDIENTS will be. 
        //you could change the type of "action" above in arguments list to just "Action" imported from @ngRx/store. But then the payload would error
        //because the generic Action type does not have a property that's public called payload.
        //you could also just replace the type of "action" from above to just "any" type. But then you wouldn't get any TS support code. 
        //the better solution is to export an additional type inthe actions.ts file. Go there. 
        //once you add the union type and change the argument type above in this reducer, then the error would go away.
        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients:[
                    ...state.ingredients,
                    ...action.payload//here you can't just do "aciton.payload" like you did with the AddIngredient case, because here, action.payload is an array already. so then you would have an 
                    //array nested inside the ingredients array here. You want to pull the elements of the action.payload array and index them in the ingredients array. 
                    //for that, you would use the spread operator ... which would pull out the elements of that array you put in front of it.
                ]
            }
        case ShoppingListActions.UPDATE_INGREDIENT:
            //for Update we first need to get what index ingredient we want to edit. 
            //the state object is always the old state or current state before anything changes. 
            //then we want to find the index of the old ingredient baseed on the "action.payload.index" which would give us
            //the ingredient we are wanting to update. 
            // const oldIngredient = state.ingredients[action.payload.index]
            //removing redundant code, the index will be removed off of the payload, since the state here in this store is already storing the editedIndex anyway. 
            //so the index will not be obtained from the payload anymore, but from this store itself. 
            const oldIngredient = state.ingredients[state.editedIngredientIndex]

            //always have to add data immutably here. so you can't just update the old state with new data values. 
            //you can't do oldIngredient.amount = action.payload.ingredient.amount would be incorrect.   that would edit the old state. 
            //instead you would create a copy. 
            const updatedIngredient = {
                ...oldIngredient,
                // ...action.payload.ingredient
                //after removing redundancy by removing the Index from your payloads, the payload itself would be the ingredient. 
                //so the payload won't have another property with ingredient.
                ...action.payload
            }   
            //you need to return an array here since in shopping-list.component.ts you need an array so that the shopping list ingredients can be looped. 
            //you would also need to create a copy of the state.ingredients. 
            const updatedIngredients = [...state.ingredients];
            //this is actually when it finally updates the old copied version of the old state with the index of whatever ingredient you wanted to update
            //with the new updatedIngredient object, which also includes copied version of the old properties with new property values. 
            //because the two objects types would have the same properties, "amount" and "name", you can just set the object of the index of that updatedIngredients
            //array with the object of what is being updated.

            // updatedIngredients[action.payload.index] = updatedIngredient
            //after removing redundant coding by removing the index off of the payload, the state.ingredientIndex can be used to determine what ingredient we are wanting
            //to update. 
            updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

            //always return new object
            return {
                ...state,
                ingredients: updatedIngredients,
                editedIngredientIndex: -1,
                editedIngredient: null
            }
        case ShoppingListActions.DELETE_INGREDIENT:
            //const deletedIngredients = [...state.ingredients];

            //deletedIngredients.splice(action.payload.index,1)


            return {
                ...state,
                //ingredients: deletedIngredients
                //since we need to return an array. you can use .filter(). filter will take an array
                //and give you a new array by default. as the callback function, we want the index of the ingredient 
                //we are wanting to remove. filter will loop through all elements of the array, and return true or false.
                //in this case, we are wanting to return all elements that their indexes do no match the index we are trying 
                //to remove. so only those elements not matching the index we are wanting removed would return true.
                ingredients: state.ingredients.filter((ingredient, ingredientIndex)=>{
                    // return ingredientIndex !== action.payload;
                    //after removing redundant coding where you remove the index off of the payloads since the store here already manages the editedIngredientIndex,
                    //replace code above with below. 
                    return ingredientIndex !== state.editedIngredientIndex;
                })
            }
        case ShoppingListActions.START_EDIT:
            return {
                //now returning the currents state is more important than every since you are editing an ingredient here, so of course you would 
                //want to send the current state before it is changed. Always return current state no matter what. But with editing stuff, is even more important. 
                ...state,
                //the index of the ingredient wanting to be edited, is part of the payload. It is required as part of the StartEdit() method in the actions.ts file. The constructor requires a payload of type number to be provided,
                //which is the index of the ingredient we are wanting to edit. 
                editedIngredientIndex: action.payload,
                //the editedIngredient itself can be obtained from using the current state ingredient and finding the index of that object based on the payload. 
                //do not do this editedIngredient: state.ingredients[action.payload]. 
                //because that would make the editedIngredient property a reference to the ingredient in your state.ingredients array and since objecst and arrays are reference types
                //if you would do that, any edits would directly edit this state directly and we do not want the state stored in this store to be changed from outside. 
                //thus, you would create a new object passing in the spread operator, which would copy a new object of that referenced array.  
                editedIngredient: {...state.ingredients[action.payload]}
            }
        case ShoppingListActions.STOP_EDIT:
            //for STOP_Edit, we just want to return everything to the current state of ingredients, but more important the properties used for editing, editedIngredient and editedIngredientIndex, return to initial values
            return {
                ...state,
                editedIngredient: null,
                editedIngredientIndex: -1
            }
        default: 
            return state; 
    }
}