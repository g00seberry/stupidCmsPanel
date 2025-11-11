import { observer } from 'mobx-react-lite';
import { useRoutes } from 'react-router-dom';
import { authStore } from '@/AuthStore';
import { MainLayout } from '@/layouts/MainLayout';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import { routes } from '@/routes';
import { useEffect } from 'react';

/**
 * Корневой компонент приложения CMS.
 */
export const App = observer(() => {
  const element = useRoutes(routes);

  useEffect(() => {
    authStore.init();
  }, []);

  if (!authStore.isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <MainLayout
      userName={authStore.user?.name}
      userEmail={authStore.user?.email}
      onLogout={() => authStore.logout()}
    >
      {element}
    </MainLayout>
  );
});
