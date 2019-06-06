import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  //not need after you add routes
  // @Output() featureSelected = new EventEmitter<string>();//create an objected based on the eventEmitted class

  constructor() { }

  ngOnInit() {
  }

  //not need after you add routes
  // onSelect(feature: string) {
  //   this.featureSelected.emit(feature);
  // }

}
