import { FilterForm, FilterFormStore, type FilterFieldConfig } from '@/components/FilterForm';
import { Input, Select } from 'antd';
import { Search } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';

/**
 * Пропсы компонента фильтров медиа-файлов.
 */
export type PropsMediaFilters = {
  /** Store для управления состоянием фильтров. */
  store: FilterFormStore;

  /** Дополнительный класс для карточки. */
  cardClassName?: string;
};

/**
 * Компонент фильтров для поиска и фильтрации медиа-файлов.
 * Предоставляет поля для поиска, фильтрации по типу, MIME, статусу удаления и сортировки.
 */
export const MediaFilters = observer<PropsMediaFilters>(({ store, cardClassName }) => {
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
