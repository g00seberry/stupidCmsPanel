import { listTerms } from '@/api/apiTerms';
import { getTaxonomy } from '@/api/apiTaxonomies';
import type { ListTermsParams, ZTerm } from '@/types/terms';
import type { ZTaxonomy } from '@/types/taxonomies';
import { PaginatedDataLoader } from '@/utils/paginatedDataLoader';
import { onError } from '@/utils/onError';
import { makeAutoObservable } from 'mobx';

const defaultFilters: ListTermsParams = {
  page: 1,
  per_page: 10,
};

/**
 * Store для управления состоянием списка терминов таксономии.
 * Обеспечивает загрузку, фильтрацию и пагинацию терминов.
 */
export class TermsListStore {
  /** Универсальный загрузчик пагинированных данных. */
  loader: PaginatedDataLoader<ZTerm, ListTermsParams> | null = null;

  /** Данные текущей таксономии. */
  taxonomy: ZTaxonomy | null = null;

  /** Флаг выполнения запроса загрузки таксономии. */
  loadingTaxonomy = false;

  setTaxonomy(taxonomy: ZTaxonomy): void {
    this.taxonomy = taxonomy;
  }

  setLoadingTaxonomy(loadingTaxonomy: boolean): void {
    this.loadingTaxonomy = loadingTaxonomy;
  }

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Инициализирует загрузку данных при первом открытии страницы.
   * @param taxonomySlug Slug таксономии для фильтрации.
   */
  async initialize(taxonomySlug: string): Promise<void> {
    this.setLoadingTaxonomy(true);
    try {
      this.setTaxonomy(await getTaxonomy(taxonomySlug));
      this.loader = new PaginatedDataLoader(
        async params => listTerms(taxonomySlug, params),
        defaultFilters
      );
      await this.loader.load();
    } catch (error) {
      onError(error);
    } finally {
      this.setLoadingTaxonomy(false);
    }
  }
}
