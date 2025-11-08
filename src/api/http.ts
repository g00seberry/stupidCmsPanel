import type { ProblemJson } from '@/types/problem-json';

export interface HttpError extends Error {
  status: number;
  problem?: ProblemJson;
  raw?: string;
}

type HttpInit = RequestInit & { body?: BodyInit | null };

export async function http<T>(input: RequestInfo | URL, init: HttpInit = {}): Promise<T> {
  const response = await fetch(input, decorateInit(init));

  if (response.status === 204) {
    return undefined as T;
  }
  if (response.ok) {
    return (await response.json()) as T;
  }

  throw await buildError(response);
}

function decorateInit(init: HttpInit): RequestInit {
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return {
    ...init,
    headers,
    credentials: 'include',
  };
}

async function buildError(response: Response): Promise<HttpError> {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/problem+json')) {
    const problem = (await response.json()) as ProblemJson;
    const error: HttpError = Object.assign(new Error(problem.title ?? 'Request failed'), {
      status: response.status,
      problem,
    });
    return error;
  }

  const raw = await response.text();
  const error: HttpError = Object.assign(new Error('Request failed'), {
    status: response.status,
    raw,
  });
  return error;
}
