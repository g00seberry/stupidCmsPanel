import { getMediaConfig } from '@/api/apiMedia';
import type { ZMediaConfig } from '@/types/media';
import { onError } from '@/utils/onError';
import type { DefaultOptionType } from 'antd/es/select';
import { makeAutoObservable } from 'mobx';

/**
 * Store для управления ограничениями типа media.
 * Управляет выбранными MIME типами файлов и загружает конфигурацию медиа из API.
 */
export class MediaConstraintsStore {
  /** Конфигурация системы медиа-файлов. */
  config: ZMediaConfig | null = null;

  /** Флаг загрузки конфигурации. */
  loading = false;

  /**
   * Создаёт экземпляр стора ограничений типа media.
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
   * Устанавливает конфигурацию медиа.
   * @param config Конфигурация медиа или `null` для сброса.
   */
  setConfig(config: ZMediaConfig | null) {
    this.config = config;
  }

  /**
   * Загружает конфигурацию системы медиа-файлов с сервера.
   */
  async loadConfig(): Promise<void> {
    this.setLoading(true);
    try {
      const config = await getMediaConfig();
      this.setConfig(config);
    } catch (error) {
      onError(error);
    } finally {
      this.setLoading(false);
    }
  }

  init() {
    this.loadConfig();
  }

  /**
   * Получает список разрешенных MIME типов из конфигурации для быстрого выбора.
   * Если конфигурация еще не загружена, возвращает пустой массив.
   * @returns Массив опций с label и value.
   */
  get allowedMimeTypes(): DefaultOptionType[] {
    if (!this.config) {
      return [];
    }
    // Преобразуем MIME типы из конфигурации в опции для Select
    return this.config.allowed_mimes.map(mime => ({
      label: mime,
      value: mime,
    }));
  }
}
