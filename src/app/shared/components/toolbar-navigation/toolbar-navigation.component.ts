import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: ['./toolbar-navigation.component.scss']
})
export class ToolbarNavigationComponent {
  constructor(
    private coockie: CookieService,
    private router: Router
  ){}

  handlerLogout(): void {
    this.coockie.delete("JWT_TOKEN");
    this.router.navigate(['/login']);
  }
}
