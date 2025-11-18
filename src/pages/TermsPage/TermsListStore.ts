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
   * @param taxonomyId ID таксономии для фильтрации.
   */
  async initialize(taxonomyId: number | string): Promise<void> {
    this.setLoading(true);
    try {
      const taxonomyIdStr = String(taxonomyId);
      this.setTaxonomy(await getTaxonomy(taxonomyIdStr));
      const tree = await getTermsTree(taxonomyIdStr);
      this.setTermsTree(tree);
    } catch (error) {
      onError(error);
    } finally {
      this.setLoading(false);
    }
  }
}
