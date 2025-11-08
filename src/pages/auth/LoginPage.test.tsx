import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { runInAction } from 'mobx';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { LoginPage } from '@/pages/auth/LoginPage';
import { httpClient } from '@/api/http';
import { authStore } from '@/stores/auth.store';

describe('LoginPage', () => {
  let requestMock: vi.SpyInstance;

  beforeEach(() => {
    if (!requestMock) {
      requestMock = vi.spyOn(httpClient, 'request');
    }
    requestMock.mockReset();
    resetStoreState();
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    requestMock.mockRestore();
  });

  it('рендерит форму входа', () => {
    renderLoginPage();

    expect(screen.getByRole('heading', { name: 'Вход в админку' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
  });

  it('отправляет форму и редиректит после 200', async () => {
    requestMock.mockResolvedValueOnce(
      successResponse({ status: 200, data: {}, config: { method: 'post' } })
    );

    const router = renderLoginPage();
    const user = userEvent.setup();

    const [emailInput] = screen.getAllByLabelText('Email');
    const [passwordInput] = screen.getAllByLabelText('Пароль');

    await user.type(emailInput, 'editor@example.com');
    await user.type(passwordInput, 'secret123');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => expect(requestMock).toHaveBeenCalledTimes(1));
    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/api/v1/auth/login',
        method: 'post',
        data: {
          email: 'editor@example.com',
          password: 'secret123',
        },
      })
    );

    await waitFor(() => expect(router.state.location.pathname).toBe('/entries'));
  });

  it('показывает сообщение об ошибке при 401', async () => {
    requestMock.mockRejectedValueOnce(
      errorResponse({
        status: 401,
        data: { title: 'Unauthorized', status: 401 },
      })
    );

    renderLoginPage();
    const user = userEvent.setup();

    const [emailInput] = screen.getAllByLabelText('Email');
    const [passwordInput] = screen.getAllByLabelText('Пароль');

    await user.type(emailInput, 'editor@example.com');
    await user.type(passwordInput, 'wrong');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('Неверный email или пароль')
    );
  });

  it('подсвечивает поля при 422', async () => {
    requestMock.mockRejectedValueOnce(
      errorResponse({
        status: 422,
        data: {
          title: 'Validation Failed',
          status: 422,
          errors: { email: ['Неверный формат email'] },
        },
      })
    );

    renderLoginPage();
    const user = userEvent.setup();

    const [emailInput] = screen.getAllByLabelText('Email');
    const [passwordInput] = screen.getAllByLabelText('Пароль');

    await user.type(emailInput, 'bad');
    await user.type(passwordInput, 'secret123');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.getByText('Неверный формат email', { selector: 'span' })).toBeInTheDocument();
    });
  });

  it('блокирует кнопку, пока запрос выполняется', async () => {
    const deferred = createDeferred<AxiosResponse>();
    requestMock.mockReturnValue(deferred.promise);

    renderLoginPage();
    const user = userEvent.setup();

    const [emailInput] = screen.getAllByLabelText('Email');
    const [passwordInput] = screen.getAllByLabelText('Пароль');

    await user.type(emailInput, 'editor@example.com');
    await user.type(passwordInput, 'secret123');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    const button = screen.getByRole('button', { name: 'Вход…' });
    await waitFor(() => expect(button).toBeDisabled());

    deferred.resolve(
      successResponse({
        status: 200,
        data: {},
      })
    );

    await waitFor(() => expect(button).not.toBeDisabled());
  });
});

function renderLoginPage() {
  const router = createMemoryRouter(
    [
      { path: '/login', element: <LoginPage /> },
      { path: '/entries', element: <div>Entries</div> },
    ],
    { initialEntries: ['/login'] }
  );

  render(<RouterProvider router={router} />);

  return router;
}

function successResponse<T>({
  status,
  data,
  config,
}: {
  status: number;
  data?: T;
  config?: Partial<AxiosRequestConfig>;
}): AxiosResponse<T> {
  return {
    data: data as T,
    status,
    statusText: '',
    headers: {},
    config: {
      url: '',
      method: 'post',
      headers: {},
      ...(config ?? {}),
    },
    request: {},
  };
}

function errorResponse<T>({ status, data }: { status: number; data?: T }) {
  return {
    isAxiosError: true,
    toJSON: () => ({}),
    name: 'AxiosError',
    message: 'Request failed',
    config: { headers: {}, method: 'post', url: '' },
    code: status >= 500 ? 'ERR_BAD_RESPONSE' : 'ERR_BAD_REQUEST',
    response: successResponse({ status, data }),
  };
}

function resetStoreState() {
  runInAction(() => {
    authStore.isAuthenticated = false;
    authStore.pending = false;
    authStore.error = null;
    authStore.fieldErrors = {};
    authStore.setOverlay(null);
  });
}

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
