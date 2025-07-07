export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  id: string;
  name: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  name: string;
  email: string;
  token: string;
}
