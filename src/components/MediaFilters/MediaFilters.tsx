import { FilterForm, FilterFormStore, type FilterFieldConfig } from '@/components/FilterForm';
import type { ZMediaListParams } from '@/types/media';
import { debounce } from '@/utils/debounce';
import { Input, Select } from 'antd';
import { Search } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';

/**
 * Пропсы компонента фильтров медиа-файлов.
 */
export type PropsMediaFilters = {
  /** Store для управления состоянием фильтров. */
  store: FilterFormStore;
  /** Обработчик применения фильтров. Вызывается при изменении значений фильтров. */
  onApply?: (filters: Partial<ZMediaListParams>) => void;
  /** Дополнительный класс для карточки. */
  cardClassName?: string;
};

/**
 * Преобразует значения формы в параметры фильтрации медиа.
 * @param values Значения формы фильтров.
 * @returns Параметры фильтрации для API.
 */
const convertToMediaFilters = (values: Record<string, unknown>): Partial<ZMediaListParams> => {
  const filters: Partial<ZMediaListParams> = {};

  if (values.q && typeof values.q === 'string' && values.q.trim()) {
    filters.q = values.q.trim();
  }

  if (values.kind && typeof values.kind === 'string') {
    filters.kind = values.kind as ZMediaListParams['kind'];
  }

  if (values.mime && typeof values.mime === 'string' && values.mime.trim()) {
    filters.mime = values.mime.trim();
  }

  if (values.collection && typeof values.collection === 'string' && values.collection.trim()) {
    filters.collection = values.collection.trim();
  }

  if (values.deleted && typeof values.deleted === 'string') {
    filters.deleted = values.deleted as ZMediaListParams['deleted'];
  }

  if (values.sort && typeof values.sort === 'string') {
    filters.sort = values.sort as ZMediaListParams['sort'];
  }

  if (values.order && typeof values.order === 'string') {
    filters.order = values.order as ZMediaListParams['order'];
  }

  return filters;
};

/**
 * Компонент фильтров для поиска и фильтрации медиа-файлов.
 * Предоставляет поля для поиска, фильтрации по типу, MIME, коллекции, статусу удаления и сортировки.
 */
export const MediaFilters = observer<PropsMediaFilters>(({ store, onApply, cardClassName }) => {
  /**
   * Конфигурация полей фильтрации.
   */
  const filterFields: FilterFieldConfig[] = useMemo(
    () => [
      {
        name: 'q',
        element: (
          <Input
            placeholder="Поиск по названию или имени файла"
            prefix={<Search className="w-4 h-4 text-muted-foreground" />}
            allowClear
          />
        ),
        className: 'flex-1 min-w-[200px]',
      },
      {
        name: 'kind',
        element: (
          <Select placeholder="Тип медиа" allowClear style={{ width: 150 }}>
            <Select.Option value="image">Изображение</Select.Option>
            <Select.Option value="video">Видео</Select.Option>
            <Select.Option value="audio">Аудио</Select.Option>
            <Select.Option value="document">Документ</Select.Option>
          </Select>
        ),
      },
      {
        name: 'mime',
        element: <Input placeholder="MIME-тип (префикс)" allowClear style={{ width: 180 }} />,
      },
      {
        name: 'collection',
        element: <Input placeholder="Коллекция" allowClear style={{ width: 150 }} />,
      },
      {
        name: 'deleted',
        element: (
          <Select placeholder="Статус удаления" allowClear style={{ width: 180 }}>
            <Select.Option value="with">Включая удаленные</Select.Option>
            <Select.Option value="only">Только удаленные</Select.Option>
          </Select>
        ),
      },
      {
        name: 'sort',
        element: (
          <Select placeholder="Сортировка" style={{ width: 150 }}>
            <Select.Option value="created_at">По дате создания</Select.Option>
            <Select.Option value="size_bytes">По размеру</Select.Option>
            <Select.Option value="mime">По MIME-типу</Select.Option>
          </Select>
        ),
        formItemProps: { initialValue: 'created_at' },
      },
      {
        name: 'order',
        element: (
          <Select placeholder="Направление" style={{ width: 120 }}>
            <Select.Option value="desc">По убыванию</Select.Option>
            <Select.Option value="asc">По возрастанию</Select.Option>
          </Select>
        ),
        formItemProps: { initialValue: 'desc' },
      },
    ],
    []
  );

  /**
   * Значения фильтров по умолчанию.
   */
  const defaultValues = useMemo(
    () => ({
      sort: 'created_at',
      order: 'desc',
    }),
    []
  );

  // Дебаунсинг применения фильтров
  const debouncedApply = debounce((filters: Partial<ZMediaListParams>) => onApply?.(filters));

  // Отслеживание изменений фильтров и вызов onApply с дебаунсингом
  useEffect(() => {
    if (Object.keys(store.values).length > 0) {
      const filters = convertToMediaFilters(store.values);
      void debouncedApply(300, filters);
    }
  }, [store.values]);

  return (
    <FilterForm
      store={store}
      fields={filterFields}
      defaultValues={defaultValues}
      cardClassName={cardClassName}
      applyText="Применить фильтры"
      resetText="Сбросить"
    />
  );
});
