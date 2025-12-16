import { Navigate } from 'react-router-dom';
import { EntriesListPage } from '@/pages/EntriesListPage/EntriesListPage';
import { EntryEditorPage } from '@/pages/EntryEditorPage/EntryEditorPage';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import { PostTypeEditorPage } from '@/pages/PostTypeEditorPage/PostTypeEditorPage';
import { PostTypesPage } from '@/pages/PostTypesPage/PostTypesPage';
import { PostTypeBlueprintsPage } from '@/pages/PostTypeBlueprintsPage/PostTypeBlueprintsPage';
import { TaxonomiesPage } from '@/pages/TaxonomiesPage/TaxonomiesPage';
import { TaxonomiesEditorPage } from '@/pages/TaxonomiesEditorPage/TaxonomiesEditorPage';
import { TermsPage } from '@/pages/TermsPage/TermsPage';
import { TermEditorPage } from '@/pages/TermEditorPage/TermEditorPage';
import { MediaListPageMain, MediaListPageTrash } from '@/pages/MediaListPage/MediaListPage';
import { MediaEditorPage } from '@/pages/MediaEditorPage/MediaEditorPage';
import { BlueprintListPage } from '@/pages/BlueprintListPage/BlueprintListPage';
import { BlueprintEditorPage } from '@/pages/BlueprintEditorPage/BlueprintEditorPage';
import { BlueprintSchemaPage } from '@/pages/BlueprintSchemaPage/BlueprintSchemaPage';
import { FormConfigPage } from '@/pages/FormConfigPage/FormConfigPage';
import { RoutesPage } from '@/pages/RoutesPage/RoutesPage';
import { RouteEditorPage } from '@/pages/RouteEditorPage/RouteEditorPage';
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
  { path: PageUrl.ContentTypesBlueprints, element: <PostTypeBlueprintsPage /> },
  { path: PageUrl.ContentTypesFormConfig, element: <FormConfigPage /> },
  { path: PageUrl.Taxonomies, element: <TaxonomiesPage /> },
  { path: PageUrl.TaxonomiesEdit, element: <TaxonomiesEditorPage /> },
  { path: PageUrl.TermsByTaxonomy, element: <TermsPage /> },
  { path: PageUrl.TermEdit, element: <TermEditorPage /> },
  { path: PageUrl.Media, element: <MediaListPageMain /> },
  { path: PageUrl.MediaEdit, element: <MediaEditorPage /> },
  { path: PageUrl.MediaTrash, element: <MediaListPageTrash /> },
  { path: PageUrl.Blueprints, element: <BlueprintListPage /> },
  { path: PageUrl.BlueprintsEdit, element: <BlueprintEditorPage /> },
  { path: PageUrl.BlueprintsSchema, element: <BlueprintSchemaPage /> },
  { path: PageUrl.Routes, element: <RoutesPage /> },
  { path: PageUrl.RouteNew, element: <RouteEditorPage /> },
  { path: PageUrl.RouteEdit, element: <RouteEditorPage /> },
  { path: '*', element: <Navigate to={PageUrl.Entries} replace /> },
];
