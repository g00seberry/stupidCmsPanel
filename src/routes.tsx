import { Navigate } from 'react-router-dom';
import { EntriesListPage } from '@/pages/EntriesListPage/EntriesListPage';
import { EntryEditorPage } from '@/pages/EntryEditorPage/EntryEditorPage';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import { PostTypeEditorPage } from '@/pages/PostTypeEditorPage/PostTypeEditorPage';
import { PostTypesPage } from '@/pages/PostTypesPage/PostTypesPage';
import { TaxonomiesPage } from '@/pages/TaxonomiesPage/TaxonomiesPage';
import { TaxonomiesEditorPage } from '@/pages/TaxonomiesEditorPage/TaxonomiesEditorPage';
import { PageUrl } from '@/PageUrl';

/**
 * Маршруты приложения CMS.
 */
export const routes = [
  { path: PageUrl.Login, element: <LoginPage /> },
  { path: PageUrl.Dashboard, element: <Navigate to={PageUrl.Entries} replace /> },
  { path: PageUrl.EntryEdit, element: <EntryEditorPage /> },
  { path: PageUrl.EntriesByType, element: <EntriesListPage /> },
  { path: PageUrl.Entries, element: <EntriesListPage /> },
  { path: PageUrl.ContentTypes, element: <PostTypesPage /> },
  { path: PageUrl.ContentTypesEdit, element: <PostTypeEditorPage /> },
  { path: PageUrl.Taxonomies, element: <TaxonomiesPage /> },
  { path: PageUrl.TaxonomiesEdit, element: <TaxonomiesEditorPage /> },
  { path: '*', element: <Navigate to={PageUrl.Entries} replace /> },
];
