import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authStore } from '@/AuthStore';
import { loginDtoSchema } from '@/api/auth';

type LocationState = {
  returnTo?: string;
};

export const LoginPage = observer(() => {
  const navigate = useNavigate();
  const location = useLocation() as { state?: LocationState };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const returnTo = location.state?.returnTo ?? '/entries';

  useEffect(() => {
    authStore.resetError();
    return () => authStore.resetError();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationErrors({});

    const result = loginDtoSchema.safeParse({ email, password });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const field = issue.path[0];
        if (field && typeof field === 'string') {
          errors[field] = issue.message;
        }
      });
      setValidationErrors(errors);
      return;
    }

    const ok = await authStore.login(result.data);
    if (ok) {
      navigate(returnTo, { replace: true });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow"
        noValidate
      >
        <h1 className="text-2xl font-semibold text-center">Вход в админку</h1>

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
              validationErrors.email || authStore.fieldErrors.email
                ? 'border-red-400'
                : 'border-gray-300'
            }`}
            autoComplete="email"
            required
            maxLength={255}
          />
          {(validationErrors.email || authStore.fieldErrors.email) && (
            <span className="text-xs text-red-600">
              {validationErrors.email || authStore.fieldErrors.email}
            </span>
          )}
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-gray-700">Пароль</span>
          <input
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            className={`mt-1 w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black ${
              validationErrors.password || authStore.fieldErrors.password
                ? 'border-red-400'
                : 'border-gray-300'
            }`}
            autoComplete="current-password"
            required
            minLength={8}
          />
          {(validationErrors.password || authStore.fieldErrors.password) && (
            <span className="text-xs text-red-600">
              {validationErrors.password || authStore.fieldErrors.password}
            </span>
          )}
        </label>

        <button
          type="submit"
          disabled={authStore.pending}
          className="w-full rounded bg-black px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
        >
          {authStore.pending ? 'Вход…' : 'Войти'}
        </button>

        <p className="text-center text-xs text-gray-500">
          Проблемы со входом?{' '}
          <Link to="#" className="font-medium text-gray-700 underline">
            Обратитесь к администратору
          </Link>
        </p>
      </form>
    </div>
  );
});

export default LoginPage;
