import { Layout } from '@/components/Layout';
import { routes } from '@/routes';
import { authStore } from '@/stores/auth.store';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';

const overlayMap = {
  login: <LoginPage />,
};
/**
 * Корневой компонент admin-приложения, отвечающий за маршрутизацию и базовый Layout.
 */
export const App = observer(() => {
  const [overlayType, setOverlayType] = useState<typeof authStore.overlayType>(null);
  const element = useRoutes(routes);
  useEffect(() => {
    setOverlayType(authStore.overlayType);
  }, [authStore.overlayType]);
  const overlay = overlayType ? overlayMap[overlayType] : null;
  if (overlay) return <Layout>{overlay}</Layout>;
  return <Layout>{element}</Layout>;
});

export default App;
