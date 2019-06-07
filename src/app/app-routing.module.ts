import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeComponent } from './recipe/recipe.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RecipeStartComponent } from './recipe/recipe-start/recipe-start.component';
import { RecipeDetailComponent } from './recipe/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe/recipe-edit/recipe-edit.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },//only redirect if the path is exact match
    //whatever the parent component is to the children, that's the component where you need to include the <router-outlet> selector in the .html file so here you would include it in RecipeComponent. 
    { path: 'recipes', component: RecipeComponent, children: [
        {path: '', component: RecipeStartComponent },
        {path: 'new', component: RecipeEditComponent },//the order here matters. so that when url is types servers/new. it will go into this path first
        {path: ':id', component: RecipeDetailComponent},    
        {path: ':id/edit', component: RecipeEditComponent }//add an edit at the end of it to define whether we are on eidt mode
    ]},
    { path: 'shopping-list', component: ShoppingListComponent}
]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]//export the RouterModule so that you can export it to the app.module.ts file. 
})

export class AppRoutingModule {

}