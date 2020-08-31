import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeComponent } from './recipe.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipesResolverService } from './recipe.resolver';
import { AuthGuard } from '../auth/auth-guard';
//import { EffectsModule } from '@ngrx/effects';
//import { StoreModule } from '@ngrx/store';
//import { StoreDevtoolsModule } from '@ngrx/store-devtools';
//import { environment } from '../../environments/environment';

const recipesRoutes: Routes = [
  { path: '', component: RecipeComponent,
    canActivate: [AuthGuard],
    children: [
        {path: '', component: RecipeStartComponent },
        {path: 'new', component: RecipeEditComponent },//the order here matters. so that when url is types servers/new. it will go into this path first
        {path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolverService]},
        {path: ':id/edit', component: RecipeEditComponent, resolve: [RecipesResolverService] }//add an edit at the end of it to define whether we are on eidt mode
    ]},
]

@NgModule({
  imports: [
    //RouterModule.forChild() should be used for all subsequent Routing Modules. forRoot() is only used in the app-routint.module. All ForChild() will be automatically inherited into the forRoot().
    RouterModule.forChild(recipesRoutes)
  ]
})
export class  RecipesRoutingModule {}
