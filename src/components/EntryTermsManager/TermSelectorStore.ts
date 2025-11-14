import { getTaxonomy } from '@/api/apiTaxonomies';
import { getTermsTree } from '@/api/apiTerms';
import type { ZTaxonomy } from '@/types/taxonomies';
import type { ZTerm, ZTermTree } from '@/types/terms';
import type { ZId } from '@/types/ZId';
import { onError } from '@/utils/onError';
import { makeAutoObservable } from 'mobx';

/**
 * Преобразует иерархическое дерево термов в плоский список.
 * @param items Массив термов (может содержать вложенные children).
 * @returns Плоский массив всех термов из дерева.
 */
const flattenTerms = (items: ZTermTree[]): ZTerm[] => {
  const result: ZTerm[] = [];
  const traverse = (terms: ZTermTree[]): void => {
    for (const term of terms) {
      const { children, ...flatTerm } = term;
      result.push(flatTerm);
      if (children && children.length > 0) {
        traverse(children);
      }
    }
  };
  traverse(items);
  return result;
};

/**
 * Store для управления состоянием компонента выбора термов.
 * Обеспечивает загрузку термов, поиск и фильтрацию для иерархических и плоских таксономий.
 */
export class TermSelectorStore {
  /** Флаг выполнения асинхронной операции загрузки данных. */
  loading = false;

  /** ID текущей таксономии. */
  taxonomyId: ZId;

  /** Дерево термов для таксономии. */
  taxonomyTree: ZTermTree[] = [];

  /** Данные таксономии. */
  taxonomyData: ZTaxonomy | null = null;

  /**
   * Создаёт экземпляр стора выбора термов.
   */
  constructor(taxonomyId: ZId) {
    this.taxonomyId = taxonomyId;
    makeAutoObservable(this);
  }

  /**
   * Устанавливает данные таксономии.
   * @param taxonomyData Данные таксономии.
   */
  setTaxonomyTree(taxonomyTree: ZTermTree[]): void {
    this.taxonomyTree = taxonomyTree;
  }

  /**
   * Устанавливает данные таксономии.
   * @param taxonomyData Данные таксономии.
   */
  setTaxonomyData(taxonomyData: ZTaxonomy): void {
    this.taxonomyData = taxonomyData;
  }

  /**
   * Загружает данные таксономии и термов.
   * Определяет тип таксономии (иерархическая или нет) и загружает соответствующие данные.
   */
  async loadData(): Promise<void> {
    const { taxonomyId } = this;
    this.loading = true;
    try {
      this.setTaxonomyTree(await getTermsTree(taxonomyId));
      this.setTaxonomyData(await getTaxonomy(taxonomyId));
    } catch (error) {
      onError(error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Плоский список всех термов из дерева.
   * Преобразует иерархическую структуру в простой массив.
   */
  get flatTerms(): ZTerm[] {
    return flattenTerms(this.taxonomyTree);
  }
}
