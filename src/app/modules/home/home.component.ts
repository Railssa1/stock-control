import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { MessageStatus } from 'src/app/shared/utils/enums/MessageStatus.enum';
import { MessageHandlerService } from 'src/app/shared/utils/message-handler.service';
import { LoginRequest, SignupRequest } from 'src/models/interfaces/user';
import { UserService } from 'src/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy {
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService,
    private messageHandlerService: MessageHandlerService,
    private router: Router
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

  private destroy$ = new Subject<void>();

  toggleCardLogin(): void {
    this.isLogin = !this.isLogin;
  }

  onSubmitLogin(): void {
    const request = this.loginForm.value as LoginRequest;
    this.userService.login(request)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (resp) => {
        this.cookieService.set("JWT_TOKEN", resp.token);
        this.loginForm.reset();
        this.router.navigate(['/dashboard']);

        this.messageHandlerService.handlerMessage(MessageStatus.Success, `Bem-vindo de volta, ${resp.name}`);
      },
      error: (err) => {
        this.messageHandlerService.handlerMessage(MessageStatus.Error, 'Falha ao realizar login, tente novamente');
        console.log(err);
      }
    });
  }

  onSubmitSignup(): void {
    const request = this.signupForm.value as SignupRequest;
    this.userService.signup(request)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.signupForm.reset();
        this.isLogin = true;
        this.messageHandlerService.handlerMessage(MessageStatus.Success, 'Usuário criado com sucesso.');
      },
      error: (err) => {
        this.messageHandlerService.handlerMessage(MessageStatus.Error, 'Usuário não criado, tente novamente');
        console.log(err);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
