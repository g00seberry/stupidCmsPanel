import { Navigate } from 'react-router-dom';
import { EntriesListPage } from '@/pages/EntriesListPage/EntriesListPage';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import { PostTypeEditorPage } from '@/pages/PostTypeEditorPage/PostTypeEditorPage';
import { PostTypesPage } from '@/pages/PostTypesPage/PostTypesPage';
import { PageUrl } from '@/PageUrl';

/**
 * Маршруты приложения CMS.
 */
export const routes = [
  { path: PageUrl.Login, element: <LoginPage /> },
  { path: PageUrl.Dashboard, element: <Navigate to={PageUrl.Entries} replace /> },
  { path: PageUrl.Entries, element: <EntriesListPage /> },
  { path: PageUrl.ContentTypes, element: <PostTypesPage /> },
  { path: PageUrl.ContentTypesEdit, element: <PostTypeEditorPage /> },
  { path: '*', element: <Navigate to={PageUrl.Entries} replace /> },
];
