export class Recipe {
    public name: string;//the name property can be assigned publicly 
    public description: string;
    public imagePath: string;

    //constructor runs when this object is instantiated
    constructor(name: string, desc:string, imagePath: string) {
        this.name = name;
        this.description = desc;
        this.imagePath = imagePath;
    }
}