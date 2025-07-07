import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments';
import { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from 'src/models/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  private readonly apiEndpoint = environments.apiUrl;

  signup(request: SignupRequest): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(`${this.apiEndpoint}/user`, request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiEndpoint}/auth`, request);
  }
}
