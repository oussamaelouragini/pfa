export interface SignUpPayload {
  fullName: string;
  email: string;
  password: string;
}
export interface SignInPayload {
  email: string;
  password: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}
export interface AuthResponse {
  user: User;
  token: string;
}
