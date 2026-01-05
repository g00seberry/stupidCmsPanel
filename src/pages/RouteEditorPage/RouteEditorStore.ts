import { createRoute, deleteRoute, getRoute, updateRoute } from '@/api/apiRoutes';
import { notificationService } from '@/services/notificationService';
import type { ZCreateRouteNodeDto, ZRouteNode, ZUpdateRouteNodeDto } from '@/types/routes';
import { onError } from '@/utils/onError';
import { makeAutoObservable } from 'mobx';

/**
 * Store для управления состоянием редактора маршрута.
 */
export class RouteEditorStore {
  /** Текущий узел маршрута. */
  route: ZRouteNode | null = null;

  /** Флаг выполнения запроса загрузки. */
  loading = false;

  /** ID маршрута для редактирования. */
  routeId: string;

  /**
   * Создаёт экземпляр стора редактора маршрута.
   * @param routeId ID маршрута для редактирования (или 'new' для создания).
   */
  constructor(routeId: string) {
    this.routeId = routeId;
    void this.loadRoute(routeId);
    makeAutoObservable(this);
  }

  /**
   * Устанавливает узел маршрута.
   * @param route Узел маршрута или null.
   */
  setRoute(route: ZRouteNode | null): void {
    this.route = route;
  }

  /**
   * Устанавливает флаг выполнения запроса загрузки.
   * @param value Новое значение флага.
   */
  setLoading(value: boolean): void {
    this.loading = value;
  }

  /**
   * Признак режима редактирования (в отличие от создания).
   */
  get isEditMode(): boolean {
    return this.routeId !== 'new';
  }

  /**
   * Загружает маршрут по ID.
   * @param id ID маршрута для загрузки.
   */
  async loadRoute(id: string): Promise<void> {
    if (!this.isEditMode) return;
    try {
      this.setLoading(true);
      this.setRoute(await getRoute(id));
    } catch (error) {
      onError(error);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Создаёт новый маршрут.
   * @param payload Данные нового маршрута.
   * @returns Созданный маршрут или `null`, если произошла ошибка.
   */
  async createRoute(payload: ZCreateRouteNodeDto): Promise<ZRouteNode | null> {
    try {
      this.setLoading(true);
      const route = await createRoute(payload);
      this.setRoute(route);
      notificationService.showSuccess({
        message: 'Маршрут создан',
      });
      return route;
    } catch (error) {
      onError(error);
      return null;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Обновляет существующий маршрут.
   * @param id ID маршрута для обновления.
   * @param payload Новые значения полей маршрута.
   * @returns Обновлённый маршрут или `null`, если произошла ошибка.
   */
  async updateRoute(id: string, payload: ZUpdateRouteNodeDto): Promise<ZRouteNode | null> {
    this.setLoading(true);
    try {
      const route = await updateRoute(id, payload);
      this.setRoute(route);
      notificationService.showSuccess({
        message: 'Маршрут обновлён',
      });
      return route;
    } catch (error) {
      onError(error);
      return null;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Удаляет маршрут.
   * @param id ID маршрута для удаления.
   */
  async deleteRoute(id: string): Promise<void> {
    this.setLoading(true);
    try {
      await deleteRoute(id);
      notificationService.showSuccess({
        message: 'Маршрут удалён',
      });
      this.setRoute(null);
    } catch (error) {
      onError(error);
    } finally {
      this.setLoading(false);
    }
  }
}
