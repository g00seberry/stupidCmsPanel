import { attachEntryTerms, detachEntryTerms, getEntryTerms } from '@/api/apiEntries';
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

  /**
   * Создаёт экземпляр стора управления термами записи.
   */
  constructor(entryId: ZId) {
    this.entryId = entryId;
    makeAutoObservable(this);
  }

  /**
   * Инициализирует стор с параметрами записи.
   * @param entryId ID записи, для которой управляются термы.
   * @param allowedTaxonomies Массив ID разрешённых таксономий.
   */
  async initialize(): Promise<void> {
    try {
      this.setEntryTerms(await getEntryTerms(this.entryId));
      this.setSelectedTaxonomy(this.availableTaxonomies[0].id ?? null);
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
   * Массив ID текущих термов записи.
   */
  get currentTermIds(): ZId[] {
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
   * Открывает модальное окно добавления термов.
   */
  openModal(): void {
    this.modalVisible = true;
  }

  /**
   * Закрывает модальное окно добавления термов.
   */
  closeModal(): void {
    this.modalVisible = false;
  }

  /**
   * Добавляет термы к записи.
   * @param selectedTermIds Массив ID выбранных термов для добавления.
   */
  async addTerms(selectedTermIds: ZId[]): Promise<void> {
    if (!this.entryId || selectedTermIds.length === 0) return;

    this.loading = true;
    try {
      const data = await attachEntryTerms(this.entryId, selectedTermIds);
      this.entryTerms = data;
    } catch (error) {
      onError(error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Удаляет терм из записи.
   * @param termId ID терма для удаления.
   */
  async removeTerm(termId: ZId): Promise<void> {
    if (!this.entryId) return;

    this.loading = true;
    try {
      this.setEntryTerms(await detachEntryTerms(this.entryId, [termId]));
    } catch (error) {
      onError(error);
    } finally {
      this.loading = false;
    }
  }
}
