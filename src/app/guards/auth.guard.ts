import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {AuthServiceService} from "../Service/auth-service.service";


@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private authService: AuthServiceService, private router: Router) {}

  canActivate(): boolean {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (loggedInUser) {
      return true;
    } else {
      this.router.navigate(['']);
      alert('Please log in to access this page');
      return false;
    }
  }
}
