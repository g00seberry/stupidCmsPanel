import { getTaxonomy } from '@/api/apiTaxonomies';
import { getTermsTree } from '@/api/apiTerms';
import type { ZTaxonomy } from '@/types/taxonomies';
import type { ZTermTree } from '@/types/terms';
import { onError } from '@/utils/onError';
import { makeAutoObservable } from 'mobx';

/**
 * Store для управления состоянием списка терминов таксономии.
 * Обеспечивает загрузку иерархии терминов.
 */
export class TermsListStore {
  /** Дерево терминов таксономии. */
  termsTree: ZTermTree[] = [];

  /** Данные текущей таксономии. */
  taxonomy: ZTaxonomy | null = null;

  /** Флаг выполнения запроса загрузки таксономии. */
  loading = false;

  setTaxonomy(taxonomy: ZTaxonomy): void {
    this.taxonomy = taxonomy;
  }

  setLoading(loading: boolean): void {
    this.loading = loading;
  }

  setTermsTree(tree: ZTermTree[]): void {
    this.termsTree = tree;
  }

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Инициализирует загрузку данных при первом открытии страницы.
   * @param taxonomySlug Slug таксономии для фильтрации.
   */
  async initialize(taxonomySlug: string): Promise<void> {
    this.setLoading(true);
    try {
      this.setTaxonomy(await getTaxonomy(taxonomySlug));
      const tree = await getTermsTree(taxonomySlug);
      this.setTermsTree(tree);
    } catch (error) {
      onError(error);
    } finally {
      this.setLoading(false);
    }
  }
}
