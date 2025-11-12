import { authStore } from '@/AuthStore';
import { Button, Card, Form, Input, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import styles from './loginPage.module.less';
import type { ZLoginDto } from '@/types/auth';

/**
 * Страница авторизации администратора.
 */
export const LoginPage = observer(() => {
  const [form] = Form.useForm<ZLoginDto>();
  const btnText = authStore.pending ? 'Вход…' : 'Войти';
  /**
   * Обрабатывает сабмит формы и выполняет валидацию.
   * @param values Текущие значения полей формы.
   */
  const handleSubmit = async (values: ZLoginDto) => {
    authStore.login(values);
  };

  return (
    <div className={styles.page}>
      <Card className={styles.card} variant="outlined">
        <Typography.Title level={3} className={styles.title}>
          Вход в админку
        </Typography.Title>

        <Form<ZLoginDto>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ email: '', password: '' }}
          autoComplete="on"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Email обязателен' }]}
          >
            <Input type="email" autoComplete="email" maxLength={255} />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Пароль обязателен' }]}
          >
            <Input.Password autoComplete="current-password" minLength={8} />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={authStore.pending}
            disabled={authStore.pending}
            aria-label={btnText}
          >
            {btnText}
          </Button>
        </Form>
      </Card>
    </div>
  );
});
