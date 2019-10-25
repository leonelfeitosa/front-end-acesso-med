import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { RouteInfo } from '../../models/route.info';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

@Component({
    // moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit{
    private listTitles: any[];
    location: Location;
    private toggleButton: any;
    private sidebarVisible: boolean;
    @Input() mode: string;
    rotasSidebarAdmin: RouteInfo[] = [
        { path: '/admin/agentes', title: 'Agentes',  icon: 'pe-7s-id', class: '' },
        { path: '/admin/clinicas', title: 'Clinicas', icon: 'pe-7s-home', class: ''},
        { path: '/admin/clientes', title: 'Clientes', icon: 'pe-7s-users', class: '' }
    ];
    rotasSidebarMedico: RouteInfo[] = [
      { path: '/medico/compras', title: 'Compras', icon: 'pe-7s-cash', class: ''}
    ];
    

    constructor(location: Location,  private element: ElementRef) {
      this.location = location;
          this.sidebarVisible = false;
    }

    ngOnInit(){
      if (this.mode === 'admin') {
        this.listTitles = this.rotasSidebarAdmin.filter(listTitle => listTitle);
      } else if (this.mode === 'medico') {
        this.listTitles = this.rotasSidebarMedico.filter(listTitle => listTitle);
      }
      
      const navbar: HTMLElement = this.element.nativeElement;
      this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
    }
    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);
        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };

    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      titlee = titlee.split('/').pop();
      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return 'Dashboard';
    }
}
