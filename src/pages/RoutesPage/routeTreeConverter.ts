import type { ZRouteNode } from '@/types/routes';
import type { TreeDataNode } from 'antd';

/**
 * Преобразует массив узлов маршрутов в формат дерева для Ant Design Tree компонента.
 * Формирует читаемые заголовки узлов с информацией о типе, методах, действиях и статусах.
 *
 * @param routes Массив узлов маршрутов для преобразования.
 * @returns Массив узлов дерева для Ant Design Tree.
 */
export function convertRoutesToTreeData(routes: ZRouteNode[]): TreeDataNode[] {
  return routes.map(route => {
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
      children: convertRoutesToTreeData(route.children || []),
      disabled: !route.enabled,
    };
  });
}
