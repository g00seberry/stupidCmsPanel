import { Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import { EntriesListPage } from '@/pages/EntriesListPage/EntriesListPage';

/**
 * Маршруты приложения CMS.
 */
export const routes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/', element: <Navigate to="/entries" replace /> },
  { path: '/entries', element: <EntriesListPage /> },
  { path: '*', element: <Navigate to="/entries" replace /> },
];
