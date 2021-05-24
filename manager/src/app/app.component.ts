import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sideNav = "false"

  onResize(event: any) {
    this.sideNav = (event.target.innerWidth <= 400) ? "true" : "false";
  }
  
}
