import { Directive, HostListener, HostBinding, ElementRef } from "@angular/core";

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective {
    //set the isOpen property to false initially since by default dropdowns are closed
    //@HostBinding to dynamically attach or detach CSS class. HostBinding can be used to bind to 
    //properties of that element. ('class') is an array of all classes that can be pushed or removed from
    //.open is the class name we want to add to the class attribute of the element
    //so b default, we are assigning a false value to the .open class existing on the class attribute of whatever element we put this on
    @HostBinding('class.open') isOpen = false;

    //when a click is triggered on the element, set the isOpen to what opposite of isOpen is
    // @HostListener('click') toggleOpen() {
    //     this.isOpen = !this.isOpen;
    // } 

    @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
        this.isOpen = this.elRef.nativeElement.contains(event.target)? !this.isOpen: false;

    }

    constructor(private elRef: ElementRef){}
}