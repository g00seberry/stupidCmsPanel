import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authStore } from '@/stores/auth.store';

type LoginFormProps = {
  className?: string;
  title?: string;
  submitLabel?: string;
  onSuccess?: () => void;
};

export const LoginForm = observer(
  ({
    className = '',
    title = 'Вход в админку',
    submitLabel = 'Войти',
    onSuccess,
  }: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
      authStore.resetError();
      return () => authStore.resetError();
    }, []);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      const ok = await authStore.login({ email, password });
      if (ok) {
        onSuccess?.();
      }
    }

    return (
      <form
        onSubmit={handleSubmit}
        className={[
          'w-full',
          'max-w-sm',
          'space-y-4',
          'rounded-lg',
          'bg-white',
          'p-6',
          'shadow',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        noValidate
      >
        <h1 className="text-2xl font-semibold text-center">{title}</h1>

        {authStore.error && (
          <div
            role="alert"
            className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {authStore.error}
          </div>
        )}

        <label className="block space-y-1">
          <span className="text-sm font-medium text-gray-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            className={`mt-1 w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black ${
              authStore.fieldErrors.email ? 'border-red-400' : 'border-gray-300'
            }`}
            autoComplete="email"
            required
            maxLength={255}
          />
          {authStore.fieldErrors.email && (
            <span className="text-xs text-red-600">{authStore.fieldErrors.email}</span>
          )}
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-gray-700">Пароль</span>
          <input
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            className={`mt-1 w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black ${
              authStore.fieldErrors.password ? 'border-red-400' : 'border-gray-300'
            }`}
            autoComplete="current-password"
            required
            minLength={8}
          />
          {authStore.fieldErrors.password && (
            <span className="text-xs text-red-600">{authStore.fieldErrors.password}</span>
          )}
        </label>

        <button
          type="submit"
          disabled={authStore.pending}
          className="w-full rounded bg-black px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
        >
          {authStore.pending ? 'Вход…' : submitLabel}
        </button>

        <p className="text-center text-xs text-gray-500">
          Проблемы со входом?{' '}
          <Link to="#" className="font-medium text-gray-700 underline">
            Обратитесь к администратору
          </Link>
        </p>
      </form>
    );
  }
);

LoginForm.displayName = 'LoginForm';
