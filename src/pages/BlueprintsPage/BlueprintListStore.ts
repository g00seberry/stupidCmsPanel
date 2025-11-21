import { makeAutoObservable } from 'mobx';
import type { ZBlueprintListItem } from '@/types/blueprint';
import { onError } from '@/utils/onError';
import { listBlueprints, deleteBlueprint as deleteBlueprintApi } from '@/api/blueprintApi';
import { PaginatedDataLoader } from '@/utils/paginatedDataLoader';
import { FilterFormStore } from '@/components/FilterForm';
import type { BasePaginationParams } from '@/utils/paginatedDataLoader';

/**
 * Параметры запроса списка Blueprint.
 */
export type BlueprintListParams = BasePaginationParams & {
  /** Поисковый запрос. */
  search?: string;
  /** Поле для сортировки. */
  sort_by?: string;
  /** Направление сортировки. */
  sort_dir?: 'asc' | 'desc';
};

const defaultFilters: BlueprintListParams = {
  page: 1,
  per_page: 15,
  sort_by: 'created_at',
  sort_dir: 'desc',
};

/**
 * Store для управления списком Blueprint.
 * Обеспечивает загрузку списка с пагинацией, поиском, сортировкой и удалением элементов.
 */
export class BlueprintListStore {
  /** Универсальный загрузчик пагинированных данных. */
  readonly loader = new PaginatedDataLoader<ZBlueprintListItem, BlueprintListParams>(
    async params => {
      const response = await listBlueprints({
        search: params.search,
        sort_by: params.sort_by,
        sort_dir: params.sort_dir,
        per_page: params.per_page,
        page: params.page,
      });
      return {
        data: response.data,
        meta: response.meta,
        links: response.links,
      };
    },
    defaultFilters
  );

  /** Store для управления формой фильтрации. */
  readonly filterStore = new FilterFormStore<BlueprintListParams>({
    search: '',
    sort_by: 'created_at',
    sort_dir: 'desc',
  });

  /** Флаг выполнения запроса удаления. */
  deleting = false;

  constructor() {
    this.filterStore.setValues({
      search: '',
      sort_by: 'created_at',
      sort_dir: 'desc',
    });
    makeAutoObservable(this);
  }

  /**
   * Устанавливает флаг выполнения запроса удаления.
   * @param deleting Значение флага.
   */
  setDeleting(deleting: boolean): void {
    this.deleting = deleting;
  }

  /**
   * Загружает список Blueprint с текущими фильтрами.
   */
  async loadBlueprints(): Promise<void> {
    await this.loader.load();
  }

  /**
   * Сбрасывает фильтры к значениям по умолчанию.
   */
  async resetFilters(): Promise<void> {
    await this.loader.resetFilters(defaultFilters);
    this.filterStore.reset({ search: '', sort_by: 'created_at', sort_dir: 'desc' });
  }

  /**
   * Инициализирует загрузку данных при первом открытии страницы.
   */
  async initialize(): Promise<void> {
    await this.loader.initialize();
  }

  /**
   * Удалить Blueprint из списка.
   * @param id Идентификатор Blueprint для удаления.
   */
  async deleteBlueprint(id: number): Promise<void> {
    this.setDeleting(true);
    try {
      await deleteBlueprintApi(id);
      await this.loadBlueprints();
    } catch (error) {
      onError(error);
      throw error;
    } finally {
      this.setDeleting(false);
    }
  }
}
