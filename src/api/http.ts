import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import type { ProblemJson } from '@/types/problem-json';

export interface HttpError extends Error {
  status: number;
  problem?: ProblemJson;
  raw?: string;
}

const client = axios.create({
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export const httpClient = client;

type HttpConfig = AxiosRequestConfig;

export async function http<T>(url: string, config: HttpConfig = {}): Promise<T> {
  try {
    const response = await httpClient.request<T>({
      url,
      ...config,
    });

    if (response.status === 204) {
      return undefined as T;
    }

    return response.data;
  } catch (error) {
    throw buildError(error);
  }
}

function buildError(error: unknown): HttpError {
  if (axios.isAxiosError(error)) {
    return fromAxiosError(error);
  }

  return Object.assign(new Error('Request failed'), {
    status: 0,
  });
}

function fromAxiosError(error: AxiosError): HttpError {
  const response = error.response as AxiosResponse<unknown> | undefined;
  const status = response?.status ?? 0;
  const data = response?.data;

  if (isProblemJson(data)) {
    return Object.assign(new Error(data.title ?? 'Request failed'), {
      status,
      problem: data,
    });
  }

  const raw = typeof data === 'string' ? data : error.message;
  return Object.assign(new Error('Request failed'), {
    status,
    raw,
  });
}

function isProblemJson(payload: unknown): payload is ProblemJson {
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }

  return (
    'errors' in payload ||
    'title' in payload ||
    'type' in payload ||
    'status' in payload ||
    'detail' in payload
  );
}
