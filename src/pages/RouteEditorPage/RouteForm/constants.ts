import type { ZHttpMethod, ZRouteNodeKind, ZRouteNodeActionType } from '@/types/routes';

/**
 * Тип опции для Select компонента с типизированным значением.
 */
type SelectOption<T> = {
  label: string;
  value: T;
};

/**
 * Доступные HTTP методы для маршрутов.
 */
export const httpMethods: readonly ZHttpMethod[] = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS',
  'HEAD',
] as const;

/**
 * Опции для выбора типа узла маршрута.
 */
export const kindOptions: SelectOption<ZRouteNodeKind>[] = [
  { label: 'Группа', value: 'group' },
  { label: 'Маршрут', value: 'route' },
];

/**
 * Опции для выбора типа действия маршрута.
 */
export const actionTypeOptions: SelectOption<ZRouteNodeActionType>[] = [
  { label: 'Контроллер', value: 'controller' },
  { label: 'Entry', value: 'entry' },
];

/**
 * Опции для выбора HTTP методов (для Select компонента).
 */
export const httpMethodOptions: SelectOption<ZHttpMethod>[] = httpMethods.map(method => ({
  label: method,
  value: method,
}));
