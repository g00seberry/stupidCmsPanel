import { makeAutoObservable } from 'mobx';
import { listRoutes } from '@/api/apiRoutes';
import { onError } from '@/utils/onError';
import type { ZRouteNode } from '@/types/routes';
import { convertRoutesToTreeData } from './routeTreeConverter';

/**
 * Store для управления состоянием списка маршрутов.
 * Обеспечивает загрузку и фильтрацию маршрутов.
 */
export class RoutesListStore {
  /** Массив загруженных маршрутов. */
  routes: ZRouteNode[] = [];

  /** Флаг выполнения запроса загрузки. */
  pending = false;

  constructor() {
    makeAutoObservable(this);
  }

  get treeData() {
    return convertRoutesToTreeData(this.routes);
  }
  /**
   * Устанавливает флаг выполнения запроса загрузки.
   * @param value Новое значение флага.
   */
  setPending(value: boolean): void {
    this.pending = value;
  }

  /**
   * Устанавливает массив маршрутов.
   * @param routes Новый массив маршрутов.
   */
  setRoutes(routes: ZRouteNode[]): void {
    this.routes = routes;
  }

  /**
   * Загружает список всех маршрутов.
   */
  async loadRoutes(): Promise<void> {
    if (this.pending) {
      return;
    }

    this.setPending(true);
    try {
      const routes = await listRoutes();
      this.setRoutes(routes);
    } catch (error) {
      onError(error);
    } finally {
      this.setPending(false);
    }
  }
}
