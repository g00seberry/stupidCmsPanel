import { Button, Drawer, Input, Space } from 'antd';
import type React from 'react';
import { useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { searchEntries } from '@/api/apiEntries';
import type { ZEntry, ZEntriesSearchFilters } from '@/types/entries';
import type { FieldRendererProps } from '../types';
import type { ZEditRefField } from '../ZComponent';
import { getValueByPath } from '@/utils/pathUtils';
import { FormField } from './common/FormField';
import { PaginatedDataLoader } from '@/components/PaginatedTable/paginatedDataLoader';
import { PaginatedTableStore } from '@/components/PaginatedTable/PaginatedTableStore';
import { PaginatedTable } from '@/components/PaginatedTable';
import type { ColumnsType } from 'antd/es/table';
import { zPatRefConstraints } from '@/types/path/pathConstraints';
import type { ZId } from '@/types/ZId';

// Колонки таблицы
const columns: ColumnsType<ZEntry> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: 'Заголовок',
    dataIndex: 'title',
    key: 'title',
    ellipsis: true,
  },
];

const buildStore = (allowedPostTypeIds: ZId[]) =>
  new PaginatedTableStore<ZEntry, ZEntriesSearchFilters>(
    new PaginatedDataLoader<ZEntry, ZEntriesSearchFilters>(searchEntries, {
      filters: { post_type_ids: allowedPostTypeIds },
      pagination: { page: 1, per_page: 15 },
    }),
    'id'
  );

/**
 * Пропсы компонента RefFieldWidget.
 */
type PropsRefFieldWidget = FieldRendererProps & {
  /** Конфигурация компонента из ZEditComponent. */
  componentConfig?: ZEditRefField;
};

/**
 * Виджет для ссылочных полей (ref).
 * Открывает Drawer с таблицей записей для выбора.
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Поле ввода с кнопкой для открытия выбора записей.
 */
export const RefFieldWidget: React.FC<PropsRefFieldWidget> = observer(
  ({ model, namePath, schema, componentConfig }) => {
    const value = getValueByPath(model.values, namePath);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { data, success } = zPatRefConstraints
      .nullish()
      .safeParse(model.getConstraints(namePath));
    if (!success) return null;
    const allowedPostTypeIds = data?.allowed_post_type_ids ?? [];
    const selectionType = schema.cardinality === 'many' ? 'checkbox' : 'radio';
    const tableStore = useMemo(
      () => buildStore(allowedPostTypeIds),
      [allowedPostTypeIds.join(',')]
    );

    const handleOpen = () => {
      tableStore.loader.initialize();
      tableStore.clearSelection();
      if (value !== undefined && value !== null) {
        const valuesToSelect = Array.isArray(value) ? value : [value];
        valuesToSelect.forEach(val => {
          tableStore.selectRow(val);
        });
      }
      setDrawerOpen(true);
    };

    const handleCancel = () => {
      setDrawerOpen(false);
    };

    // Обработчик сохранения
    const handleSave = () => {
      const selectedKeys = tableStore.getSelectedKeys();
      const value = schema.cardinality === 'many' ? selectedKeys : selectedKeys[0];
      model.setValue(namePath, value);
      setDrawerOpen(false);
    };

    // Формируем отображаемое значение с использованием related данных
    const getDisplayValue = (): string => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return '';
      }

      const entryIds = Array.isArray(value) ? value : [value];
      const relatedEntryData = model.relatedData?.entryData;

      if (relatedEntryData) {
        const titles = entryIds
          .map(id => {
            const entryData = relatedEntryData[String(id)];
            return entryData?.entryTitle || String(id);
          })
          .filter(Boolean);
        return titles.join(', ');
      }

      return Array.isArray(value) ? value.join(', ') : String(value);
    };

    const displayValue = getDisplayValue();
    return (
      <>
        <FormField model={model} namePath={namePath} componentConfig={componentConfig}>
          <Input
            value={displayValue}
            readOnly
            onClick={handleOpen}
            placeholder="Нажмите для выбора"
            className="cursor-pointer"
          />
        </FormField>

        <Drawer
          open={drawerOpen}
          onClose={handleCancel}
          width="60%"
          title="Выбор записи"
          extra={
            <Space>
              <Button onClick={handleCancel}>Отмена</Button>
              <Button type="primary" onClick={handleSave}>
                Сохранить
              </Button>
            </Space>
          }
        >
          <PaginatedTable
            store={tableStore}
            columns={columns}
            selectionType={selectionType}
            emptyText="Записи отсутствуют"
          />
        </Drawer>
      </>
    );
  }
);
