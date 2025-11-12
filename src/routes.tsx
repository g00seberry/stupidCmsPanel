import { Navigate } from 'react-router-dom';
import { EntriesListPage } from '@/pages/EntriesListPage/EntriesListPage';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import { PostTypeEditorPage } from '@/pages/PostTypeEditorPage/PostTypeEditorPage';
import { PostTypesPage } from '@/pages/PostTypesPage/PostTypesPage';

/**
 * Маршруты приложения CMS.
 */
export const routes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/', element: <Navigate to="/entries" replace /> },
  { path: '/entries', element: <EntriesListPage /> },
  { path: '/content-types', element: <PostTypesPage /> },
  { path: '/content-types/new', element: <PostTypeEditorPage /> },
  { path: '/content-types/:slug', element: <PostTypeEditorPage /> },
  { path: '*', element: <Navigate to="/entries" replace /> },
];
