import { listPostTypes } from '@/api/apiPostTypes';
import type { ZPostType } from '@/types/postTypes';
import { onError } from '@/utils/onError';
import type { DefaultOptionType } from 'antd/es/select';
import { makeAutoObservable } from 'mobx';

/**
 * Store для управления ограничениями типа ref.
 * Загружает список типов контента и управляет выбранными значениями.
 */
export class RefConstraintsStore {
  /** Список доступных типов контента. */
  postTypes: ZPostType[] = [];

  /** Флаг загрузки списка типов контента. */
  loading = false;

  /**
   * Создаёт экземпляр стора ограничений типа ref.
   */
  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Устанавливает флаг загрузки.
   * @param value Новое значение флага загрузки.
   */
  setLoading(value: boolean) {
    this.loading = value;
  }

  /**
   * Устанавливает список типов контента.
   * @param postTypes Массив типов контента.
   */
  setPostTypes(postTypes: ZPostType[]) {
    this.postTypes = postTypes;
  }

  /**
   * Загружает список типов контента с сервера.
   */
  async loadPostTypes(): Promise<void> {
    this.setLoading(true);
    try {
      const postTypes = await listPostTypes();
      this.setPostTypes(postTypes);
    } catch (error) {
      onError(error);
    } finally {
      this.setLoading(false);
    }
  }

  init() {
    this.loadPostTypes();
  }

  /**
   * Получает опции для Select компонента.
   * @returns Массив опций с label и value.
   */
  get postTypeOptions(): DefaultOptionType[] {
    return this.postTypes.map(pt => ({
      label: pt.name,
      value: pt.id,
    }));
  }
}
