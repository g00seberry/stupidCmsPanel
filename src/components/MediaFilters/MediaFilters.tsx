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
          <Select
            placeholder="Тип медиа"
            allowClear
            style={{ width: 150 }}
            options={[
              { label: 'Изображение', value: 'image' },
              { label: 'Видео', value: 'video' },
              { label: 'Аудио', value: 'audio' },
              { label: 'Документ', value: 'document' },
            ]}
          />
        ),
      },
      {
        name: 'mime',
        element: <Input placeholder="MIME-тип (префикс)" allowClear style={{ width: 180 }} />,
      },
      {
        name: 'deleted',
        element: (
          <Select
            placeholder="Статус удаления"
            allowClear
            style={{ width: 180 }}
            options={[
              { label: 'Включая удаленные', value: 'with' },
              { label: 'Только удаленные', value: 'only' },
            ]}
          />
        ),
      },
      {
        name: 'sort',
        element: (
          <Select
            placeholder="Сортировка"
            style={{ width: 150 }}
            options={[
              { label: 'По дате создания', value: 'created_at' },
              { label: 'По размеру', value: 'size_bytes' },
              { label: 'По MIME-типу', value: 'mime' },
            ]}
          />
        ),
        formItemProps: { initialValue: 'created_at' },
      },
      {
        name: 'order',
        element: (
          <Select
            placeholder="Направление"
            style={{ width: 120 }}
            options={[
              { label: 'По убыванию', value: 'desc' },
              { label: 'По возрастанию', value: 'asc' },
            ]}
          />
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
