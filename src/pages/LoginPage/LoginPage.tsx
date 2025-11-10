import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authStore } from '@/AuthStore';
import type { ZLoginField } from '@/types/auth';
import { zLoginDto } from '@/types/auth';

/**
 * Дополнительные параметры навигации, сохраняемые при редиректе на форму входа.
 */
type LocationState = {
  returnTo?: string;
};

/**
 * Значения формы авторизации.
 */
type FormValues = {
  email: string;
  password: string;
};

/**
 * Страница авторизации администратора.
 */
export const LoginPage = observer(() => {
  const navigate = useNavigate();
  const location = useLocation() as { state?: LocationState };
  const [form] = Form.useForm<FormValues>();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const returnTo = location.state?.returnTo ?? '/entries';

  useEffect(() => {
    authStore.resetError();
    return () => authStore.resetError();
  }, []);

  const emailError = validationErrors.email ?? authStore.fieldErrors.email ?? '';
  const passwordError = validationErrors.password ?? authStore.fieldErrors.password ?? '';

  /**
   * Обрабатывает сабмит формы и выполняет валидацию.
   * @param values Текущие значения полей формы.
   */
  const handleSubmit = async (values: FormValues) => {
    setValidationErrors({});

    const result = zLoginDto.safeParse(values);

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
  };

  /**
   * Сбрасывает сообщения об ошибках при изменении значений полей.
   * @param changedValues Обновлённые значения отдельных полей.
   */
  const handleValuesChange = (changedValues: Partial<FormValues>) => {
    const field = Object.keys(changedValues)[0] as keyof FormValues | undefined;
    if (!field) return;

    setValidationErrors(prev => {
      if (!prev[field]) {
        return prev;
      }
      const next = { ...prev };
      delete next[field];
      return next;
    });

    if (authStore.fieldErrors[field as ZLoginField]) {
      const next = { ...authStore.fieldErrors };
      delete next[field as ZLoginField];
      authStore.setFieldErrors(next);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#f5f5f5',
      }}
    >
      <Card
        style={{ width: 360, maxWidth: '100%' }}
        styles={{ body: { padding: 24 } }}
        variant="outlined"
      >
        <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          Вход в админку
        </Typography.Title>

        {authStore.error && (
          <Alert
            role="alert"
            type="error"
            message={authStore.error}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form<FormValues>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={handleValuesChange}
          initialValues={{ email: '', password: '' }}
          autoComplete="on"
          requiredMark={false}
          noValidate
        >
          <Form.Item
            label="Email"
            name="email"
            validateStatus={emailError ? 'error' : undefined}
            help={emailError || undefined}
          >
            <Input type="email" autoComplete="email" maxLength={255} />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            validateStatus={passwordError ? 'error' : undefined}
            help={passwordError || undefined}
          >
            <Input.Password autoComplete="current-password" minLength={8} />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={authStore.pending}
            disabled={authStore.pending}
            aria-label={authStore.pending ? 'Вход…' : 'Войти'}
          >
            {authStore.pending ? 'Вход…' : 'Войти'}
          </Button>
        </Form>

        <Typography.Paragraph
          style={{ textAlign: 'center', marginTop: 16, fontSize: 12 }}
          type="secondary"
        >
          Проблемы со входом?{' '}
          <Link to="#" style={{ fontWeight: 500 }}>
            Обратитесь к администратору
          </Link>
        </Typography.Paragraph>
      </Card>
    </div>
  );
});
