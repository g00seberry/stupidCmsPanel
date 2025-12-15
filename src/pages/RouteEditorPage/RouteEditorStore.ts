import { createRoute, deleteRoute, getRoute, updateRoute } from '@/api/apiRoutes';
import { notificationService } from '@/services/notificationService';
import type { ZRouteNode } from '@/types/routes';
import type { ZCreateRouteNodeDto, ZUpdateRouteNodeDto } from '@/types/routes';
import { onError } from '@/utils/onError';
import { makeAutoObservable } from 'mobx';
import type { AxiosError } from 'axios';
import { zProblemJson, type ZProblemJson } from '@/types/ZProblemJson';

const idNew = 'new';

/**
 * Store для управления состоянием редактора маршрута.
 */
export class RouteEditorStore {
  /** Текущий узел маршрута. */
  route: ZRouteNode | null = null;

  /** Флаг выполнения запроса загрузки. */
  loading = false;

  /** Флаг выполнения запроса сохранения. */
  saving = false;

  /** Ошибки валидации из API. */
  errors: Record<string, string[]> = {};

  /** ID маршрута для редактирования. */
  routeId: number | typeof idNew;

  /**
   * Создаёт экземпляр стора редактора маршрута.
   * @param routeId ID маршрута для редактирования (или 'new' для создания).
   */
  constructor(routeId: number | typeof idNew) {
    this.routeId = routeId;
    makeAutoObservable(this);
    if (this.isEditMode) {
      void this.init();
    }
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
   * Устанавливает флаг выполнения запроса сохранения.
   * @param value Новое значение флага.
   */
  setSaving(value: boolean): void {
    this.saving = value;
  }

  /**
   * Устанавливает ошибки валидации.
   * @param errors Объект с ошибками валидации.
   */
  setErrors(errors: Record<string, string[]>): void {
    this.errors = errors;
  }

  /**
   * Очищает ошибки валидации.
   */
  clearErrors(): void {
    this.errors = {};
  }

  /**
   * Признак режима редактирования (в отличие от создания).
   */
  get isEditMode(): boolean {
    return this.routeId !== idNew;
  }

  /**
   * Инициализирует стор: загружает маршрут, если указан ID.
   */
  async init(): Promise<void> {
    if (!this.isEditMode) {
      return;
    }

    try {
      this.setLoading(true);
      const route = await getRoute(this.routeId as number);
      this.setRoute(route);
    } catch (error) {
      onError(error);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Загружает маршрут по ID.
   * @param id ID маршрута для загрузки.
   */
  async loadRoute(id: number): Promise<void> {
    try {
      this.setLoading(true);
      const route = await getRoute(id);
      this.setRoute(route);
      this.clearErrors();
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
    console.log(payload);
    this.setSaving(true);
    this.clearErrors();

    try {
      const route = await createRoute(payload);
      this.setRoute(route);
      notificationService.showSuccess({
        message: 'Маршрут создан',
      });
      return route;
    } catch (error) {
      this.handleValidationErrors(error);
      onError(error);
      return null;
    } finally {
      this.setSaving(false);
    }
  }

  /**
   * Обновляет существующий маршрут.
   * @param id ID маршрута для обновления.
   * @param payload Новые значения полей маршрута.
   * @returns Обновлённый маршрут или `null`, если произошла ошибка.
   */
  async updateRoute(id: number, payload: ZUpdateRouteNodeDto): Promise<ZRouteNode | null> {
    this.setSaving(true);
    this.clearErrors();

    try {
      const route = await updateRoute(id, payload);
      this.setRoute(route);
      notificationService.showSuccess({
        message: 'Маршрут обновлён',
      });
      return route;
    } catch (error) {
      this.handleValidationErrors(error);
      onError(error);
      return null;
    } finally {
      this.setSaving(false);
    }
  }

  /**
   * Удаляет маршрут.
   * @param id ID маршрута для удаления.
   */
  async deleteRoute(id: number): Promise<void> {
    try {
      await deleteRoute(id);
      notificationService.showSuccess({
        message: 'Маршрут удалён',
      });
      this.setRoute(null);
    } catch (error) {
      onError(error);
    }
  }

  /**
   * Обрабатывает ошибки валидации из ответа API.
   * Извлекает ошибки из формата Problem JSON и сохраняет их в Store.
   * @param error Ошибка из запроса.
   */
  private handleValidationErrors(error: unknown): void {
    if ((error as AxiosError).response?.status === 422) {
      const problemResult = zProblemJson.safeParse((error as AxiosError).response?.data);
      if (problemResult.success) {
        const data = problemResult.data as ZProblemJson & { errors?: Record<string, string[]> };
        const apiErrors = data.meta?.errors || data.errors;
        if (apiErrors && typeof apiErrors === 'object') {
          this.setErrors(apiErrors);
        }
      }
    }
  }
}
