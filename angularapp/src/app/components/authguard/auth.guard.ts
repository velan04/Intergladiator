import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const url: string = state.url;
    const user = localStorage.getItem('userRole');

    if (user) {
      if (this.isAdminRoute(url) && user !== 'Admin') {
        console.log('User is not Admin but tried to access Admin route');
        this.router.navigate(['/error']);
        return false;
      }

      if (this.isUserRoute(url) && user !== 'User') {
        console.log('Admin tried to access User route');
        this.router.navigate(['/error']);
        return false;
      }

      if (this.isCommonRoute(url)) {
        return true;
      }

      return true;
    }

    // No user logged in
    this.router.navigate(['/login']);
    return false;
  }

  private isAdminRoute(url: string): boolean {
    const adminRoutes = [
      'admin/add/event',
      'admin/view/viewevent',
      'admin/view/attendees',
      'admin/view/feedback'
    ];
    return adminRoutes.some(route => url.includes(route));
  }

  private isUserRoute(url: string): boolean {
    const userRoutes = [
      'user/view/events',
      'user/register/event',
      'user/feedback'
    ];
    return userRoutes.some(route => url.includes(route));
  }

  private isCommonRoute(url: string): boolean {
    const commonRoutes = ['', 'login', 'signup'];
    return commonRoutes.some(route => url.includes(route));
  }
}
