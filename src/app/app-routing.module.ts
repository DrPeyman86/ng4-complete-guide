import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { RecipeComponent } from './recipe/recipe.component';
// import { ShoppingListComponent } from './shopping-list/shopping-list.component';
// import { RecipeStartComponent } from './recipe/recipe-start/recipe-start.component';
// import { RecipeDetailComponent } from './recipe/recipe-detail/recipe-detail.component';
// import { RecipeEditComponent } from './recipe/recipe-edit/recipe-edit.component';
// import { RecipesResolverService } from './recipe/recipe.resolver';
import { AuthComponent } from './auth/auth.component';
// import { AuthGuard } from './auth/auth-guard';

const appRoutes: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },//only redirect if the path is exact match
    //whatever the parent component is to the children, that's the component where you need to include the <router-outlet> selector in the .html file so here you would include it in RecipeComponent.
    //moved this into its own recipes-routing.module
    // { path: 'recipes', component: RecipeComponent,
    // canActivate: [AuthGuard],
    // children: [
    //     {path: '', component: RecipeStartComponent },
    //     {path: 'new', component: RecipeEditComponent },//the order here matters. so that when url is types servers/new. it will go into this path first
    //     {path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolverService]},
    //     {path: ':id/edit', component: RecipeEditComponent, resolve: [RecipesResolverService] }//add an edit at the end of it to define whether we are on eidt mode
    // ]},
    // { path: 'shopping-list', component: ShoppingListComponent},//moved to shopping-list.module
    { path: 'auth', component: AuthComponent}
]
 @NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    //we need to export the RouterModule because every module works on its own in ANgular. they don't communicate with each other. if you declare a component in a certain component
    //in a certain moudle like app module , if we declare a component in some module, then we can only use it in that module and nowhere else
    exports: [RouterModule]//export the RouterModule so that you can export it to the app.module.ts file.
})

export class AppRoutingModule {

}
