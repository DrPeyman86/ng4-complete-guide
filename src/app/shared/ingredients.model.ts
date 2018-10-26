export class Ingredient {
    // public name: string;
    // public amount: number;

    // constructor(name: string, amount: number) {
    //     this.name = name;
    //     this.amount = amount;
    // }
    /*the above constructor code can be replaced for shorthand with 
    following. which makes a property public, expects the argument sent 
    to the constructor, and it will set the property*/
    constructor(public name: string, public amount: number) {}
}