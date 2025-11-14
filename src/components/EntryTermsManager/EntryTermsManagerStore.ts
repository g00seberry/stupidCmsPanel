import { attachEntryTerms, detachEntryTerms, getEntryTerms } from '@/api/apiEntries';
import { listTaxonomies } from '@/api/apiTaxonomies';
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
  /** Список всех таксономий. */
  taxonomies: ZTaxonomy[] = [];
  /** Флаг выполнения асинхронной операции. */
  loading = false;
  /** ID выбранной таксономии для добавления термов. */
  selectedTaxonomy: ZId | null = null;
  /** Флаг видимости модального окна добавления термов. */
  modalVisible = false;
  /** Массив ID выбранных термов для добавления. */
  selectedTermIds: ZId[] = [];
  /** ID записи, для которой управляются термы. */
  entryId: ZId | null = null;
  /** Массив ID разрешённых таксономий. */
  allowedTaxonomies: ZId[] = [];

  /**
   * Создаёт экземпляр стора управления термами записи.
   */
  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Инициализирует стор с параметрами записи.
   * @param entryId ID записи, для которой управляются термы.
   * @param allowedTaxonomies Массив ID разрешённых таксономий.
   */
  initialize(entryId: ZId, allowedTaxonomies: ZId[] = []): void {
    const entryIdChanged = this.entryId !== entryId;
    const taxonomiesChanged =
      this.allowedTaxonomies.length !== allowedTaxonomies.length ||
      !this.allowedTaxonomies.every((id, index) => id === allowedTaxonomies[index]);

    this.entryId = entryId;
    this.allowedTaxonomies = allowedTaxonomies;

    if (taxonomiesChanged || this.taxonomies.length === 0) {
      void this.loadTaxonomies();
    }

    if (entryIdChanged) {
      void this.loadEntryTerms();
    }
  }

  /**
   * Обновляет ID записи и перезагружает термы.
   * @param entryId Новый ID записи.
   */
  setEntryId(entryId: ZId): void {
    if (this.entryId !== entryId) {
      this.entryId = entryId;
      void this.loadEntryTerms();
    }
  }

  /**
   * Обновляет список разрешённых таксономий.
   * @param allowedTaxonomies Новый список ID разрешённых таксономий.
   */
  setAllowedTaxonomies(allowedTaxonomies: ZId[]): void {
    this.allowedTaxonomies = allowedTaxonomies;
    void this.loadTaxonomies();
  }

  /**
   * Список доступных таксономий с учётом ограничений.
   */
  get availableTaxonomies(): ZTaxonomy[] {
    if (this.allowedTaxonomies.length === 0) return this.taxonomies;
    return this.taxonomies.filter(t => this.allowedTaxonomies.includes(t.id));
  }

  /**
   * Текущие термы записи в плоском виде с информацией о таксономии.
   */
  get currentTerms(): Array<ZTerm & { taxonomy: ZId }> {
    if (!this.entryTerms?.terms_by_taxonomy) return [];
    return this.entryTerms.terms_by_taxonomy.flatMap(group =>
      group.terms.map(term => ({ ...term, taxonomy: group.taxonomy.id }))
    );
  }

  /**
   * Массив ID текущих термов записи.
   */
  get currentTermIds(): ZId[] {
    return this.currentTerms.map(term => term.id);
  }

  /**
   * Загружает список таксономий.
   */
  async loadTaxonomies(): Promise<void> {
    try {
      const data = await listTaxonomies();
      this.taxonomies = data;
      const filtered =
        this.allowedTaxonomies.length > 0
          ? data.filter(t => this.allowedTaxonomies.includes(t.id))
          : data;
      if (filtered.length > 0 && !this.selectedTaxonomy) {
        this.selectedTaxonomy = filtered[0].id;
      }
    } catch (error) {
      onError(error);
    }
  }

  /**
   * Загружает термы записи.
   */
  async loadEntryTerms(): Promise<void> {
    if (!this.entryId) return;

    this.loading = true;
    try {
      const data = await getEntryTerms(this.entryId);
      this.entryTerms = data;
    } catch (error) {
      onError(error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Устанавливает ID выбранной таксономии.
   * @param taxonomyId ID таксономии.
   */
  setSelectedTaxonomy(taxonomyId: ZId | null): void {
    this.selectedTaxonomy = taxonomyId;
    this.selectedTermIds = [];
  }

  /**
   * Устанавливает массив ID выбранных термов.
   * @param termIds Массив ID термов.
   */
  setSelectedTermIds(termIds: ZId[]): void {
    this.selectedTermIds = termIds;
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
   * @param disabled Флаг отключения операции.
   */
  async addTerms(disabled = false): Promise<void> {
    if (disabled || !this.entryId || this.selectedTermIds.length === 0) return;

    const newTermIds = this.selectedTermIds.filter(id => !this.currentTermIds.includes(id));
    if (newTermIds.length === 0) {
      this.closeModal();
      return;
    }

    this.loading = true;
    try {
      const data = await attachEntryTerms(this.entryId, newTermIds);
      this.entryTerms = data;
      this.closeModal();
    } catch (error) {
      onError(error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Удаляет терм из записи.
   * @param termId ID терма для удаления.
   * @param disabled Флаг отключения операции.
   */
  async removeTerm(termId: ZId, disabled = false): Promise<void> {
    if (disabled || !this.entryId) return;

    this.loading = true;
    try {
      const data = await detachEntryTerms(this.entryId, [termId]);
      this.entryTerms = data;
    } catch (error) {
      onError(error);
    } finally {
      this.loading = false;
    }
  }
}
