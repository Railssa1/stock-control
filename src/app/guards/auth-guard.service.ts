import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  canActivate(): boolean {
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.userService.isLoggedIn();
  }

}
