import { NgModule } from "@angular/core";
import { AlertComponent } from "./alert/alert.component";
import { PlaceholderDirective } from "./placeholder/placeholder.directive";
import { DropdownDirective } from "./dropdown.directive";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [
        AlertComponent,
        LoadingSpinnerComponent,
        PlaceholderDirective,
        DropdownDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        AlertComponent,
        LoadingSpinnerComponent,
        PlaceholderDirective,
        DropdownDirective,
        CommonModule
    ],
    //entryComponents are components that should be loaded with Angular when Angular loads.
    //typically components when Declared throughout the application are either instantiated by a selector or when they are designated as the component
    //when clicking on a path/routing. Since the AlertComponent is now created by programmatically calling that component, it never has neither of the 2 traditional
    //methods of instantiating components. So the entryComponents array you can declare components that should be loaded at point of entry
    entryComponents: [ 
        AlertComponent
    ]
    
})

export class SharedModule {}