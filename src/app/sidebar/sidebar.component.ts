import { Component, OnInit, Input } from '@angular/core';
import { RouteInfo } from '../models/route.info';
declare const $: any;


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  @Input() routes: RouteInfo[];
  

  constructor() { }

  ngOnInit() {
    this.menuItems = this.routes.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
