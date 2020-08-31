import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { RecipeService } from "../recipe/recipe.service";
import { Recipe } from "../recipe/recipes.model";
import { map, tap, take, exhaustMap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";

@Injectable({providedIn:'root'})
//when you pass in an object providedIn:'root' you don't need to "PROVIDE" this service in the app.module providers array because this object
//will allow this service to be used anyways in the root level, so you don't need to add it to providers array in app.module

export class DataStorageService {
    constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) {}

    //you could pass in the Recipe model array as an argument to this method and store it independently from the recipe.service.ts
    // storeRecipes(recipes: Recipe[]) {

    // }

    //better way would be to use the same recipe.service.ts since that service already has all data stored in the arryas there
    storeRecipes() {
        const recipes = this.recipeService.getRecipes();

        //this put method is designed to replace everything from what you provide it as an object here. It's custom for firebase service using here. 
        //other backend codes could have different behavior. /recipe.json at the end is also firebase unique requirement. so we are essentially 
        //overwriting the recipe.json file when we use the .put() method
        this.http.put('https://ng-course-recipe-book-513f1.firebaseio.com/recipes.json', recipes)
        .subscribe(response=>{
            console.log(response);
        })
    }

    fetchRecipes() {
        //console.log('here');
        //after adding authentication token to your requests, comment out the following codes with lines 61~ and below
        return this.http.get<Recipe[]>('https://ng-course-recipe-book-513f1.firebaseio.com/recipes.json')
        //fix bug - if you fetch recipes that have no ingredients, it will error in the RecipeDetailComponent because recipe.ingredients will be undefiend for whatever recipe
        //that does not have any ingredients added. to fix that, use the .pipe(map()) rxjs operators to transform the data before it is received. 
        .pipe(map(recipes=>{
            //.map() here is the regular JS .map array method. It's not the same things as the rxjs operator map above
            return recipes.map(recipe=>{
                //return a new object and use the spread operator to copy the object into a new one. 
                //...recipe spread operator with the object will copy all properties within that object into the object we are returning here. 
                //ingredients property which is what Recipes[] model expoects use ternary expression where we just check whether recipe.ingreidnets exists or not. if it does, use it, if not, 
                //set it to empty array. 
                return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
            })
        }), 
        tap(recipes=>{
            this.recipeService.setRecipes(recipes);
        }))
        //following lines would be commented out now
        //after adding tap() operator above, .subscribe() not needed, just subscribe() to wherever this function is being called. 
        // .subscribe(recipes=>{
        //     //console.log(recipes);
        //     //with the generic type of response we are expecting above, recipes below would error out because TS doesn't know what the return type of 
        //     //recipes is, all it thinks it knows is that is not what setRecipes() expects, which is a recipes of type recipes[] array. 
        //     //so use generic annotation to say that the response body will be of type Recipe[] array. 
        //     this.recipeService.setRecipes(recipes);
        // })

        //after addding authentication, you need to pass in the token to the backend. this replace code above between lines 33~ to 58~. 
        //however these lines get deprecated again after adding an INTERCEPT, which basically does the same thing . 
        // return this.authService.user.pipe(
        //     //ultimately we need to be able to subscribe to the HTTP observable when calling this fetchRecipes method. 
        //     //however, you cannot have a return of something inside another .subscribe() of an observable. 
        //     //we don't need to do a full .subscribe() to the this.authService.user, since we don't care about, we only care about the user at this point of time, 
        //     //when this method was called. 
        //     //the take() operator takes a number, which basically states how many times we want to take the value of that observable, and then after, it should automatically unsubsribe().
        //     //so in this case, we only want the value ONCE, and then it would automatically unsubscribe().
        //     take(1),
        //     //you cannot have a return of something inside another .subscribe() of an observable.
        //     //so you need to chain the 2 observables into one big observable.
        //     //use exhaustMap to wait for the observable, in this case, this.auth.user.pipe(take(1)) is the observable. exhaustMap would wait for that observable to complete, whichs gets us the "user"
        //     //then it would presumably, have an object, which we called "user" since that's what we want. 
        //     exhaustMap(user => {
        //         //once the first observable, the authService.user observable is complete. ExhaustMap runs the second observable, but exhaustMap also
        //         //REPLACES the outer observable(s) with the very INNER observable, which in this case is the HTTP observable. 
        //         return this.http.get<Recipe[]>('https://ng-course-recipe-book-513f1.firebaseio.com/recipes.json', 
        //         {
        //             params: new HttpParams().set('auth', user.token)//you can set QueryParams by this. QueryParams are required by Firebase, other REST APIs may require you to send the token on the header.
        //         })
        //     }),
        //     //since you are already in the.pipe() operator above, you would just chain the map and tap operator as NEXT steps after the exhaustMap
        //     //then you ultimately RETURN everything, hence RETURN above line 61~, which still allows you to .subscribe() to the fetchRecipes() method from wherever it's being called.
        //     map(recipes=>{
        //         //.map() here is the regular JS .map array method. It's not the same things as the rxjs operator map above
        //         return recipes.map(recipe=>{
        //             //return a new object and use the spread operator to copy the object into a new one. 
        //             //...recipe spread operator with the object will copy all properties within that object into the object we are returning here. 
        //             //ingredients property which is what Recipes[] model expoects use ternary expression where we just check whether recipe.ingreidnets exists or not. if it does, use it, if not, 
        //             //set it to empty array. 
        //             return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        //         })
        //     }), 
        //     tap(recipes=>{
        //         this.recipeService.setRecipes(recipes);
        //     })
        // );//pipe() end

    }

}