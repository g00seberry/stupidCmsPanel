import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/stores/auth.store';
import { LoginPage } from '@/pages/auth/LoginPage';
import { EntriesListPage } from '@/pages/entries/EntriesListPage';
import { Layout } from '@/components/Layout';

const Private = observer(() => {
  const location = useLocation();

  if (!authStore.isAuthenticated) {
    const target = location.pathname + location.search;
    authStore.setReturnTo(target);

    return <Navigate to="/login" state={{ returnTo: target }} replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
});

export const routes = [
  { path: '/login', element: <LoginPage /> },
  {
    element: <Private />,
    children: [
      { index: true, element: <Navigate to="/entries" replace /> },
      { path: '/entries', element: <EntriesListPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/entries" replace /> },
];
