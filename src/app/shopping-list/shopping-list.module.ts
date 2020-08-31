import { NgModule } from "@angular/core";
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { LoggingService } from "../logging.service";
//import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: ShoppingListComponent}
    ]),
    //SharedModule
  ],
  //by providing the LoggingService here in the providers of this shopping list module, you would have created a new INSTANCE of this module, just for this module alone. Not the same instance as 
  //the once provided in the app.module.ts. This is not a bug, it may be useful in some cases, but in general, when a service is provided, it would have the @injectable provided in root,
  //so it would be provided through the entire app where it is only 1 instance. 
  // providers: [
  //   LoggingService
  // ]
})

export class ShoppingListModule {}
