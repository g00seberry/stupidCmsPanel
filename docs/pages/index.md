# Страницы

Автосгенерировано из `src/pages`.

## Роуты

| Путь | Компонент |
| --- | --- |
| `/content-types` | `PostTypesPage` |
| `/content-types/:slug` | `PostTypeEditorPage` |
| `/` | `-` |
| `/entries` | `EntriesListPage` |
| `/entries/:postType` | `EntriesListPage` |
| `/entries/:postType/:id` | `EntryEditorPage` |
| `/login` | `LoginPage` |
| `/media` | `-` |
| `/seo` | `-` |
| `/settings` | `-` |
| `/taxonomies` | `TaxonomiesPage` |
| `/taxonomies/:id` | `TaxonomiesEditorPage` |
| `/taxonomies/:taxonomyId/terms/:id` | `TermEditorPage` |
| `/taxonomies/:taxonomyId/terms` | `TermsPage` |
| `article` | `-` |

## Структура файлов

### EntriesListPage

- `EntriesListPage.tsx`
- `EntriesListStore.ts`

### EntryEditorPage

- `EntryEditorHeader.tsx`
- `EntryEditorPage.tsx`
- `EntryEditorStore.ts`

### LoginPage

- `LoginPage.tsx`

### PostTypeEditorPage

- `PostTypeEditorPage.tsx`
- `PostTypeEditorStore.ts`

### PostTypesPage

- `PostTypesPage.tsx`

### TaxonomiesEditorPage

- `TaxonomiesEditorPage.tsx`
- `TaxonomiesEditorStore.ts`

### TaxonomiesPage

- `TaxonomiesPage.tsx`

### TermEditorPage

- `TermEditorPage.tsx`
- `TermEditorStore.ts`

### TermsPage

- `TermsListStore.ts`
- `TermsPage.tsx`

