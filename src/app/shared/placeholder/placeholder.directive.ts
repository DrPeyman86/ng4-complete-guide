import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector: '[appPlaceholder]'
})

export class PlaceholderDirective {
    //you need to inject the ViewContainerRef, and this automatically gives you access to the referece to a pointer at the place where this directive is being used
    //so this will allow you to get information about the place where you use the directive . this will not just be coordinates of where the component in the DOM 
    //is being used, but it also provides the ref some useful methods, for example creating the component in the place that it needs to sit in the DOM
    //so you essentially get access to the place where the directive is added to and not just get access to where the component should sit, but also add something 
    //there at that location 
    //you need to turn the ViewContainerRef into a public property. so that you can acess the viewcontainerRef from outside. 
    //we need it public because now we will be able to add the directive to some place in our DOM and on templates and then get access to it with @ViewChild 
    //and then get access to the ViewContainerRef to work with that viewContainerRef of that directive
    constructor(public viewContainerRef: ViewContainerRef){}
}