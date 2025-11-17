

export interface User {
  id: string | number;
  username: string;
  email: string;
  picture?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginSuccessPayload {
  user: User;
  token: string;
}
