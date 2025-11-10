import { http } from '@/api/http';
import { zLoginDto, zLoginResponse } from '@/types/auth';
import type { ZLoginDto, ZLoginResponse } from '@/types/auth';

export async function login(dto: ZLoginDto): Promise<ZLoginResponse> {
  const payload = zLoginDto.parse(dto);
  const response = await http<unknown>('/api/v1/auth/login', {
    method: 'post',
    data: payload,
  });
  return zLoginResponse.parse(response);
}

export async function logout(options: { all?: boolean } = {}): Promise<void> {
  await http<unknown>('/api/v1/auth/logout', {
    method: 'post',
    data: options.all ? { all: true } : undefined,
  });
}

export async function fetchCsrfToken(): Promise<void> {
  await http<unknown>('/api/v1/auth/csrf', { method: 'get' });
}
