import { syncEntryTerms, getEntryTerms } from '@/api/apiEntries';
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
  private pendingTermIds: Set<ZId> = new Set();

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
   * Все термы записи из всех таксономий.
   */
  private get allCurrentTermIds(): Set<ZId> {
    if (!this.entryTerms) return new Set();
    const allIds = new Set<ZId>();
    this.entryTerms.terms_by_taxonomy.forEach(group => {
      group.terms.forEach(term => {
        allIds.add(term.id);
      });
    });
    return allIds;
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
   * Открывает модальное окно добавления термов.
   * Инициализирует временное состояние текущими термами.
   */
  openModal(): void {
    this.modalVisible = true;
    this.initializePendingState();
  }

  /**
   * Закрывает модальное окно добавления термов.
   * Сбрасывает временное состояние.
   */
  closeModal(): void {
    this.modalVisible = false;
    this.resetPendingState();
  }

  /**
   * Инициализирует временное состояние текущими термами записи из всех таксономий.
   */
  private initializePendingState(): void {
    this.pendingTermIds = new Set(this.allCurrentTermIds);
  }

  /**
   * Сбрасывает временное состояние.
   */
  private resetPendingState(): void {
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
   * Применяет все изменения из временного состояния.
   * Синхронизирует термы записи с финальным списком из временного состояния.
   */
  async applyPendingChanges(): Promise<void> {
    if (!this.entryId || !this.modalVisible) return;

    const pendingTermIds = Array.from(this.pendingTermIds);

    this.loading = true;
    try {
      const data = await syncEntryTerms(this.entryId, pendingTermIds);
      this.setEntryTerms(data);
      this.closeModal();
    } catch (error) {
      onError(error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Добавляет терм к записи.
   * @param termId ID терма для добавления.
   */
  async addTerm(termId: ZId): Promise<void> {
    if (!this.entryId) return;

    const currentTermIds = Array.from(this.allCurrentTermIds);
    if (currentTermIds.includes(termId)) return;

    const newTermIds = [...currentTermIds, termId];

    this.loading = true;
    try {
      const data = await syncEntryTerms(this.entryId, newTermIds);
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

    const currentTermIds = Array.from(this.allCurrentTermIds);
    if (!currentTermIds.includes(termId)) return;

    const newTermIds = currentTermIds.filter(id => id !== termId);

    this.loading = true;
    try {
      const data = await syncEntryTerms(this.entryId, newTermIds);
      this.setEntryTerms(data);
    } catch (error) {
      onError(error);
    } finally {
      this.loading = false;
    }
  }
}
