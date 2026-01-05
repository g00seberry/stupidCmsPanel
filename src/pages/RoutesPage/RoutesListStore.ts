import { makeAutoObservable } from 'mobx';
import { listRoutes } from '@/api/apiRoutes';
import { onError } from '@/utils/onError';
import type { ZRouteNode } from '@/types/routes';
import type { TreeDataNode } from 'antd';

/**
 * Store для управления состоянием списка маршрутов.
 * Обеспечивает загрузку и фильтрацию маршрутов.
 */
export class RoutesListStore {
  /** Массив загруженных маршрутов. */
  routes: ZRouteNode[] = [];

  /** Флаг выполнения запроса загрузки. */
  pending = false;

  /** Флаг начальной загрузки данных. */
  initialLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  get treeData() {
    const routes2tree = (data: ZRouteNode[]): TreeDataNode[] => {
      return data.map(route => {
        // Формируем основной идентификатор узла
        const mainIdentifier = route.uri || route.name || route.prefix || `[ID: ${route.id}]`;

        // Формируем части заголовка
        const parts: string[] = [];

        // Основной идентификатор (жирный)
        parts.push(mainIdentifier);

        // HTTP методы (для route)
        if (route.kind === 'route' && route.methods && route.methods.length > 0) {
          parts.push(`[${route.methods.join(', ')}]`);
        }

        // Тип узла и действия
        const typeParts: string[] = [];
        typeParts.push(route.kind === 'route' ? 'Route' : 'Group');
        if (route.action_type) {
          typeParts.push(route.action_type === 'controller' ? 'Controller' : 'Entry');
        }
        if (typeParts.length > 0) {
          parts.push(`(${typeParts.join(' • ')})`);
        }

        // Action или Entry ID
        if (route.action_type === 'controller' && route.action) {
          const shortAction =
            route.action.length > 40 ? `${route.action.slice(0, 40)}...` : route.action;
          parts.push(`→ ${shortAction}`);
        } else if (route.action_type === 'entry' && route.entry_id) {
          parts.push(`→ Entry #${route.entry_id}`);
        }

        // Дополнительная информация для групп
        if (route.kind === 'group') {
          const groupInfo: string[] = [];
          if (route.prefix) {
            groupInfo.push(`prefix: ${route.prefix}`);
          }
          if (route.namespace) {
            groupInfo.push(`ns: ${route.namespace}`);
          }
          if (route.domain) {
            groupInfo.push(`domain: ${route.domain}`);
          }
          if (groupInfo.length > 0) {
            parts.push(`[${groupInfo.join(', ')}]`);
          }
        }

        // Статусы (в конце)
        const statuses: string[] = [];
        if (!route.enabled) {
          statuses.push('🔴 Disabled');
        }
        if (route.readonly) {
          statuses.push('🔒 Readonly');
        }
        if (statuses.length > 0) {
          parts.push(statuses.join(' '));
        }

        // Формируем финальный заголовок с разделителями
        const title = parts.join('  ');

        return {
          key: route.id,
          title,
          children: routes2tree(route.children || []),
          disabled: !route.enabled,
        };
      });
    };
    return routes2tree(this.routes);
  }
  /**
   * Устанавливает флаг выполнения запроса загрузки.
   * @param value Новое значение флага.
   */
  setPending(value: boolean): void {
    this.pending = value;
  }

  /**
   * Устанавливает флаг начальной загрузки данных.
   * @param value Новое значение флага.
   */
  setInitialLoading(value: boolean): void {
    this.initialLoading = value;
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
      this.setInitialLoading(false);
    }
  }

  /**
   * Инициализирует загрузку данных при первом открытии страницы.
   */
  async initialize(): Promise<void> {
    this.setInitialLoading(true);
    await this.loadRoutes();
  }
}
