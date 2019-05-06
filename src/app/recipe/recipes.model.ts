import { Ingredient } from '../shared/ingredients.model';
export class Recipe {
    public name: string;//the name property can be assigned publicly
    public description: string;
    public imagePath: string;
    public ingredients: Ingredient[];//eventually want to add ingredients to the recipe model so that you will also be able to see what ingredients are needed for each recipe.


    //constructor runs when this object is instantiated
    //the constructor method allows you to insantiate this object with the "new" keyword where you set the object in your code
    //you would expect to get an Ingredient array when instantiating this model.
    constructor(name: string, desc:string, imagePath: string, ingredients: Ingredient[]) {
        this.name = name;
        this.description = desc;
        this.imagePath = imagePath;
        this.ingredients = ingredients;
    }
}
