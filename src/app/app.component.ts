import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  //do not need this after adding routing. 
  // title = 'ng4-complete-guide';
  // loadedFeature = 'recipe';//by default load the recipe feature page

  // onNavigate(feature: string) {
  //   this.loadedFeature = feature;
  // }
  constructor(private authService: AuthService){}
  ngOnInit() {
    this.authService.autoLogin();
  }
}
