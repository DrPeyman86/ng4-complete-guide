import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode: boolean = false;//initially load as we are not in edit mode. 

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params)=> {
          this.id = +params["id"]
          //this is a nice short way of setting a boolean to true or false. 
          //if params[id] is undefined, it would mean we should not be in edit mode. So params['id'] != null will return true if "id" is not null meaning we should be on edit mode. 
          this.editMode = params['id'] != null;
        }
      )
  }

}
