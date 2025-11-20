/**
 * URL внутренних страниц приложения.
 */
export const PageUrl = {
  Dashboard: '/',
  Media: '/media',
  MediaEdit: '/media/:id',
  MediaTrash: '/media/trash',
  Taxonomies: '/taxonomies',
  TaxonomiesEdit: '/taxonomies/:id',
  TermsByTaxonomy: '/taxonomies/:taxonomyId/terms',
  TermEdit: '/taxonomies/:taxonomyId/terms/:id',
  ContentTypes: '/content-types',
  ContentTypesEdit: '/content-types/:slug',
  Seo: '/seo',
  Settings: '/settings',
  Login: '/login',
  Entries: '/entries',
  EntriesByType: '/entries/:postType',
  EntryEdit: '/entries/:postType/:id',
  Blueprints: '/blueprints',
  BlueprintsEdit: '/blueprints/:id',
} as const;

/**
 * Создает URL путем подстановки параметров в шаблон.
 * @param template Шаблон URL с плейсхолдерами вида `:paramName` (например, `/part/:id`).
 * @param params Объект с параметрами для подстановки (например, `{id: 123}`).
 * @returns URL с подставленными значениями параметров.
 * @example
 * buildUrl('/part/:id', { id: 123 }) // '/part/123'
 * buildUrl('/content-types/:slug', { slug: 'article' }) // '/content-types/article'
 */
export const buildUrl = <T extends Record<string, string | number>>(
  template: string,
  params: T
): string => {
  let url = template;
  for (const [key, value] of Object.entries(params)) {
    url = url.replace(`:${key}`, String(value));
  }
  return url;
};
