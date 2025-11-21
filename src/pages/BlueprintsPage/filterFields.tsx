import { Input } from 'antd';
import type { FilterFieldConfig } from '@/components/FilterForm';

/**
 * Возвращает конфигурацию полей фильтрации для списка Blueprint.
 * @returns Массив конфигураций полей фильтрации.
 */
export const getBlueprintFilterFields = (): FilterFieldConfig[] => [
  {
    name: 'search',
    element: <Input.Search placeholder="Поиск по названию или коду..." allowClear />,
    className: 'flex-1 min-w-[200px]',
  },
];
