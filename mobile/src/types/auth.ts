export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  tokens: {
    refresh: string;
    access: string;
  };
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    role: string;
    is_verified: boolean;
    is_active: boolean;
  };
}