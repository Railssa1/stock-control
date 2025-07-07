import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { LoginRequest, SignupRequest } from 'src/models/interfaces/user';
import { UserService } from 'src/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService,
    private messageService: MessageService
  ) { }

  isLogin = true;

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  signupForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  toggleCardLogin(): void {
    this.isLogin = !this.isLogin;
  }

  onSubmitLogin(): void {
    const request = this.loginForm.value as LoginRequest;
    this.userService.login(request).subscribe({
      next: (resp) => {
        this.cookieService.set("JWT_TOKEN", resp.token);
        this.loginForm.reset();
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Bem-vindo de volta, ${resp.name}`
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Falha ao realizar login, tente novamente'
        });
        console.log(err);
      }
    });
  }

  onSubmitSignup(): void {
    const request = this.signupForm.value as SignupRequest;
    this.userService.signup(request).subscribe({
      next: () => {
        this.signupForm.reset();
        this.isLogin = true;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário criado com sucesso.'
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Usuário não criado, tente novamente'
        });
        console.log(err);
      }
    });
  }
}
