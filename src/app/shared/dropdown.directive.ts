import { Directive, HostListener, HostBinding } from "@angular/core";

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective {
    //set the isOpen property to false initially since by default dropdowns are closed
    //@HostBinding to dynamically attach or detach CSS class. HostBinding can be used to bind to 
    //properties of that element. ('class') is an array of all classes that can be pushed or removed from
    //.open is the class name we want to add to the class attribute of the element
    @HostBinding('class.open') isOpen = false;

    //when a click is triggered on the element, set the isOpen to what opposite of isOpen is
    @HostListener('click') toggleOpen() {
        this.isOpen = !this.isOpen;
    } 

}