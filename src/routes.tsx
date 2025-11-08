import { Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/LoginPage';
import { EntriesListPage } from '@/pages/entries/EntriesListPage';

export const routes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/', element: <Navigate to="/entries" replace /> },
  { path: '/entries', element: <EntriesListPage /> },
  { path: '*', element: <Navigate to="/entries" replace /> },
];
