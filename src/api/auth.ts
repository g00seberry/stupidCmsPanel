import { http } from '@/api/http';

export type LoginDto = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: number;
  email: string;
  name: string;
};

export type LoginResponse = {
  user: AuthUser;
};

export async function login(dto: LoginDto): Promise<LoginResponse> {
  return http<LoginResponse>('/api/v1/auth/login', {
    method: 'post',
    data: dto,
  });
}

export async function logout(options: { all?: boolean } = {}): Promise<void> {
  await http<unknown>('/api/v1/auth/logout', {
    method: 'post',
    params: options.all ? { all: 1 } : undefined,
  });
}

export async function fetchCsrfToken(): Promise<void> {
  await http<unknown>('/api/v1/auth/csrf', { method: 'get' });
}
