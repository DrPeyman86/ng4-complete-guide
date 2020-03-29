import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "./recipes.model";
import { DataStorageService } from "../shared/data-storage.service";
import { RecipeService } from "./recipe.service";

@Injectable({providedIn: 'root'})


export class RecipesResolverService implements Resolve<Recipe[]> {
    constructor(private dataStorageService: DataStorageService, private recipesService: RecipeService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        
        const recipes = this.recipesService.getRecipes();

        //add this check to first check whether there are recipes on the client before overriding the recipes to whathever is in the database. 
        //without this check, if you want to Edit Recipe and Save. Before it actually sends the Save request to the backend, this interceptor would run, and 
        //set the recipes back to what they were before you did any changes. 
        //So only update the recipes in the client, if there were no recipes from the backend. 
        if(recipes.length === 0) {
            return this.dataStorageService.fetchRecipes();
        } else {
            return recipes;
        }
    }
}