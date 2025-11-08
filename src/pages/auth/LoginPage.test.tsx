import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { runInAction } from 'mobx';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginPage } from '@/pages/auth/LoginPage';
import { authStore } from '@/stores/auth.store';

describe('LoginPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    resetStoreState();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('рендерит форму входа', () => {
    renderLoginPage();

    expect(screen.getByRole('heading', { name: 'Вход в админку' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
  });

  it('отправляет форму и редиректит после 200', async () => {
    const fetchMock = vi.fn().mockResolvedValue(successResponse({ status: 200, body: {} }));
    vi.stubGlobal('fetch', fetchMock);

    const router = renderLoginPage();
    const user = userEvent.setup();

    const [emailInput] = screen.getAllByLabelText('Email');
    const [passwordInput] = screen.getAllByLabelText('Пароль');

    await user.type(emailInput, 'editor@example.com');
    await user.type(passwordInput, 'secret123');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'editor@example.com',
          password: 'secret123',
          remember: true,
        }),
      })
    );

    await waitFor(() => expect(router.state.location.pathname).toBe('/entries'));
  });

  it('показывает сообщение об ошибке при 401', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      successResponse({
        status: 401,
        body: { title: 'Unauthorized', status: 401 },
        contentType: 'application/problem+json',
      })
    );
    vi.stubGlobal('fetch', fetchMock);

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
    const fetchMock = vi.fn().mockResolvedValue(
      successResponse({
        status: 422,
        body: {
          title: 'Validation Failed',
          status: 422,
          errors: { email: ['Неверный формат email'] },
        },
        contentType: 'application/problem+json',
      })
    );
    vi.stubGlobal('fetch', fetchMock);

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
    const deferred = createDeferred<Response>();
    const fetchMock = vi.fn().mockReturnValue(deferred.promise);
    vi.stubGlobal('fetch', fetchMock);

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
        body: {},
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
  runInAction(() => {
    authStore.returnTo = '/entries';
  });

  return router;
}

function successResponse({
  status,
  body,
  contentType = 'application/json',
}: {
  status: number;
  body?: unknown;
  contentType?: string;
}) {
  const payload = body === undefined ? null : JSON.stringify(body);
  return new Response(payload, {
    status,
    headers: {
      'Content-Type': contentType,
    },
  });
}

function resetStoreState() {
  runInAction(() => {
    authStore.isAuthenticated = false;
    authStore.pending = false;
    authStore.error = null;
    authStore.fieldErrors = {};
    authStore.setReturnTo(null);
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
