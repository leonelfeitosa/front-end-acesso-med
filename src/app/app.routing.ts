import { AuthComponent } from './pages/auth/auth.component';
import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuardService } from './guards/auth-guard.service';


import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';


const routes: Routes = [
    {
    path: '',
    redirectTo: 'admin/agentes',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    component: AuthComponent
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivateChild: [AuthGuardService],
    children: [
        {
      path: 'admin',
      loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
  }], },
  {
    path: '**',
    redirectTo: 'admin/agentes'
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
