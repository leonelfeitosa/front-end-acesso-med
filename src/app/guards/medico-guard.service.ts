import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class MedicoGuardService implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.authService.checkToken().pipe(map((data) => {
      return true;
    }, () => {
      this.router.navigateByUrl('/auth/login');
      return false;
    }))
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.authService.checkToken().pipe(map((data) => {
      if (data.type === 'medico')
        return true;
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      this.router.navigateByUrl('/auth/login')
      
      return false;
    }),
    catchError((err) => {
      this.router.navigateByUrl('/auth/login')
      return of(false)
    }))
  }
}
