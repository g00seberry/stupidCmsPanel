import { getEntryTerms } from '@/api/apiEntries';
import type { ZEntryTermsData } from '@/types/entries';
import type { ZTaxonomy } from '@/types/taxonomies';
import type { ZTerm } from '@/types/terms';
import type { ZId } from '@/types/ZId';
import { onError } from '@/utils/onError';
import { makeAutoObservable } from 'mobx';

/**
 * Store для управления состоянием управления термами записи.
 * Обеспечивает загрузку, добавление и удаление термов записи.
 */
export class EntryTermsManagerStore {
  /** Данные о термах записи. */
  entryTerms: ZEntryTermsData | null = null;
  /** Флаг выполнения асинхронной операции. */
  loading = false;
  /** ID выбранной таксономии для добавления термов. */
  selectedTaxonomy: ZId | null = null;
  /** Флаг видимости модального окна добавления термов. */
  modalVisible = false;
  /** ID записи, для которой управляются термы. */
  entryId: ZId;
  /** Временное состояние выбранных термов в модальном окне. */
  pendingTermIds: Set<ZId> = new Set();
  /** Кэш термов по ID для быстрого доступа. */
  termsCache: Map<ZId, ZTerm> = new Map();

  /**
   * Создаёт экземпляр стора управления термами записи.
   */
  constructor(entryId: ZId) {
    this.entryId = entryId;
    makeAutoObservable(this);
  }

  /**
   * Инициализирует стор с параметрами записи.
   * @param termIds Массив ID термов из формы (опционально, используется только для инициализации pendingTermIds).
   */
  async initialize(termIds?: ZId[]): Promise<void> {
    try {
      const entryTerms = await getEntryTerms(this.entryId);
      this.setEntryTerms(entryTerms);
      // Инициализируем pendingTermIds если переданы termIds
      if (termIds) {
        this.pendingTermIds = new Set(termIds);
      }
    } catch (error) {
      onError(error);
    }
  }

  /**
   * Список доступных таксономий с учётом ограничений.
   */
  get availableTaxonomies(): ZTaxonomy[] {
    return this.entryTerms?.terms_by_taxonomy.map(group => group.taxonomy) ?? [];
  }

  /**
   * Текущие термы записи в плоском виде с информацией о таксономии.
   */
  get currentTerms(): ZTerm[] {
    const selectedDomainTerms = this.entryTerms?.terms_by_taxonomy.find(
      group => group.taxonomy.id === this.selectedTaxonomy
    );
    if (!selectedDomainTerms) return [];
    return selectedDomainTerms.terms.map(term => ({
      ...term,
      taxonomy: selectedDomainTerms.taxonomy.id,
    }));
  }

  /**
   * Массив ID текущих термов записи для выбранной таксономии.
   * Если модальное окно открыто, возвращает временное состояние (все выбранные термы из всех таксономий).
   * TermSelector сам отфильтрует нужные термы по taxonomyId.
   */
  get currentTermIds(): ZId[] {
    if (this.modalVisible) {
      return Array.from(this.pendingTermIds);
    }
    return this.currentTerms.map(term => term.id);
  }

  /**
   * Устанавливает данные о термах записи.
   * @param entryTerms Данные о термах записи.
   */
  setEntryTerms(entryTerms: ZEntryTermsData): void {
    this.entryTerms = entryTerms;
  }

  /**
   * Устанавливает ID выбранной таксономии.
   * @param taxonomyId ID таксономии.
   */
  setSelectedTaxonomy(taxonomyId: ZId | null): void {
    this.selectedTaxonomy = taxonomyId;
  }

  /**
   * Открывает модальное окно добавления термов для указанной таксономии.
   * Инициализирует временное состояние текущими термами из формы.
   * @param taxonomyId ID таксономии, для которой открывается модальное окно.
   * @param termIds Массив ID термов из формы.
   */
  openModal(taxonomyId: ZId, termIds: ZId[] = []): void {
    this.selectedTaxonomy = taxonomyId;
    this.modalVisible = true;
    this.pendingTermIds = new Set(termIds);
  }

  /**
   * Закрывает модальное окно добавления термов.
   * Сбрасывает временное состояние.
   */
  closeModal(): void {
    this.modalVisible = false;
    this.pendingTermIds = new Set();
  }

  /**
   * Обновляет временное состояние выбранных термов.
   * @param termId ID терма для добавления или удаления.
   * @param checked Флаг выбора терма.
   */
  updatePendingTerm(termId: ZId, checked: boolean): void {
    if (checked) {
      this.pendingTermIds.add(termId);
    } else {
      this.pendingTermIds.delete(termId);
    }
  }

  /**
   * Добавляет термы в кэш.
   * @param terms Массив термов для кэширования.
   */
  cacheTerms(terms: ZTerm[]): void {
    for (const term of terms) {
      this.termsCache.set(term.id, term);
    }
  }

  /**
   * Строит список термов для отображения на основе value из формы.
   * Использует кэш для термов, которых нет в entryTerms.
   * @param termIds Массив ID термов из формы.
   * @returns Данные о термах для отображения.
   */
  buildDisplayTerms(termIds: ZId[]): ZEntryTermsData | null {
    if (!this.entryTerms) return null;

    const termIdsSet = new Set(termIds);
    const result: ZEntryTermsData = {
      entry_id: this.entryId,
      terms_by_taxonomy: [],
    };

    // Для каждой таксономии собираем термы из entryTerms и кэша
    for (const group of this.entryTerms.terms_by_taxonomy) {
      const terms: ZTerm[] = [];

      // Добавляем термы из entryTerms
      for (const term of group.terms) {
        if (termIdsSet.has(term.id)) {
          terms.push({
            ...term,
            taxonomy: group.taxonomy.id,
          });
        }
      }

      // Добавляем термы из кэша, которых нет в entryTerms
      for (const termId of termIds) {
        if (!terms.find(t => t.id === termId)) {
          const cachedTerm = this.termsCache.get(termId);
          // Проверяем, что терм принадлежит этой таксономии
          if (cachedTerm) {
            // Добавляем taxonomy из группы, так как в кэше может не быть этого поля
            terms.push({
              ...cachedTerm,
              taxonomy: group.taxonomy.id,
            });
          }
        }
      }

      // Всегда показываем все таксономии, даже если в них нет выбранных термов
      // Это позволяет пользователю видеть все доступные таксономии и добавлять термы
      result.terms_by_taxonomy.push({
        taxonomy: group.taxonomy,
        terms,
      });
    }

    return result;
  }
}
