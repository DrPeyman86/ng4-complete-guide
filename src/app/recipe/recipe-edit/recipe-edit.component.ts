import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipes.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode: boolean = false;//initially load as we are not in edit mode. 
  recipeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params)=> {
          this.id = +params["id"]
          //this is a nice short way of setting a boolean to true or false. 
          //if params[id] is undefined, it would mean we should not be in edit mode. So params['id'] != null will return true if "id" is not null meaning we should be on edit mode. 
          this.editMode = params['id'] != null;
          this.initForm();//only call the initForm when and IF the params subscription changes. So every time the id changes on the page coming in from other pages params, change the form and populate fields
        }
      )
  }

  //reload your lists this way maybe if you have a subscription and your load of list needs to wait on that subscription before it can be loaded. 
  //dont always load things on ngOnInit(). 
  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    //each recipe can have an array of ingredients. so set an initial value of recipeINgredients as a FormArray with it being empty initially. 
    let recipeIngredients = new FormArray([])

    if(this.editMode) {
      const recipe= this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;

      //check for if recipe does have an property called ingredients which would be of type array if it does. 
      if(recipe['ingredients']) {
        //if it does look that array. 
        //console.log(recipe.ingredients);
        for (let ingredient of recipe.ingredients) {
          //push each index of that array into the recipeIngredients array as a new FormGroup, which will make it isolated properties of the rest of the FOrmGroup object.
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            })
          )
        }
        console.log(recipeIngredients);
      }
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      //ingredients will be an array, so you can just set it to the array defined above. 
      //even if the recipeIngredients does not have any initial values, it would just be an empty array which is also ok
      'ingredients': recipeIngredients
    })
  }

  getControls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient() {
    //(<FormArray>)will CAST it as an Array that you can push to that Control. So ingredients is the ControlName we want to treat as an array so that we can push 
    //new FormGroup every time the button is clicked to add new Ingredient. 
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    )
  }

  onDeleteIngredient(index: number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onCancel() {
    this.router.navigate(['../', {relativeTo: this.route}])//this would go up one level. relative to the path we are on. 
  }

  onSubmit() {
    //console.log(this.recipeForm);
    const newRecipe = new Recipe(
      this.recipeForm.value['name'],
      this.recipeForm.value['description'],
      this.recipeForm.value['imagePath'],
      this.recipeForm.value['ingredients']
      )

    //since the properties of the Recipe model are exactly the same as the properties of the recipeForm, you can skip the const newRecipe defintiion abover and just pass 
    //the "this.recipeForm.value" since that is the type of Recipe model to the service below. 
    if(this.editMode) {
      // this.recipeService.updateRecipe(this.id, newRecipe)
      this.recipeService.updateRecipe(this.id, this.recipeForm.value)
    } else {
      // this.recipeService.addRecipe(newRecipe);
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.onCancel();
  }

}
