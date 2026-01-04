import { PaginatedTable, PaginatedTableStore } from '@/components/PaginatedTable';
import { zPathRefConstraints } from '@/types/path/pathConstraints';
import { Button, Drawer, Select, Space } from 'antd';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import { useMemo } from 'react';
import { FormField } from '../common/FormField';
import { refFieldColumns } from './RefFieldWidget.columns';
import { refFieldConstants } from './RefFieldWidget.constants';
import { RefFieldWidgetStore } from './RefFieldWidget.store';
import type { RefFieldWidgetProps } from './RefFieldWidget.types';
import { searchEntries } from '@/api/apiEntries';
import { PaginatedDataLoader } from '@/components/PaginatedTable/paginatedDataLoader';
import type { ZEntry, ZEntriesSearchFilters } from '@/types/entries';
import type { ZId } from '@/types/ZId';
import { getValueByPath, pathToString } from '@/utils/pathUtils';

/**
 * Создаёт экземпляр store для пагинированной таблицы выбора записей.
 * @param allowedPostTypeIds Массив разрешённых ID типов контента для фильтрации.
 * @returns Экземпляр PaginatedTableStore для работы с записями.
 */
const createTableStore = (
  allowedPostTypeIds: ZId[]
): PaginatedTableStore<ZEntry, ZEntriesSearchFilters> => {
  const filters: ZEntriesSearchFilters =
    allowedPostTypeIds.length > 0 ? { post_type_ids: allowedPostTypeIds } : {};

  const loader = new PaginatedDataLoader<ZEntry, ZEntriesSearchFilters>(searchEntries, {
    filters,
    pagination: {
      page: 1,
      per_page: refFieldConstants.perPage,
    },
  });

  return new PaginatedTableStore<ZEntry, ZEntriesSearchFilters>(loader, 'id');
};

/**
 * Виджет для ссылочных полей (ref).
 * Открывает Drawer с таблицей записей для выбора.
 * Поддерживает выбор одной записи (cardinality: 'one') или множественный выбор (cardinality: 'many').
 * Использует related данные для отображения заголовков записей вместо ID.
 *
 * @param props Пропсы рендерера поля и конфигурация компонента.
 * @returns Поле ввода с кнопкой для открытия выбора записей и Drawer с таблицей.
 *
 * @example
 * <RefFieldWidget
 *   model={formModel}
 *   namePath={['author']}
 *   schema={fieldSchema}
 *   componentConfig={config}
 * />
 */
export const RefFieldWidget: React.FC<RefFieldWidgetProps> = observer(
  ({ model, namePath, schema, componentConfig }) => {
    const namePathKey = JSON.stringify(namePath);
    const constraints = useMemo(() => {
      const constraintsData = model.getConstraints(namePath);
      const parseResult = zPathRefConstraints.nullish().safeParse(constraintsData);
      return parseResult.success ? parseResult.data : null;
    }, [model, namePathKey]);
    if (!constraints) return null;

    const allowedPostTypeIds = constraints.allowed_post_type_ids ?? [];
    const selectionType = schema.cardinality === 'many' ? 'checkbox' : 'radio';

    // Создаём и мемоизируем store для виджета
    const [widgetStore, tableStore] = useMemo(() => {
      const store = new RefFieldWidgetStore({ model, namePath });
      const table = createTableStore(allowedPostTypeIds);
      return [store, table];
    }, [model, namePathKey, JSON.stringify(allowedPostTypeIds)]);

    const value = getValueByPath(model.values, namePath);
    const arrVal = Array.isArray(value) ? value : [value].filter(Boolean);
    /**
     * Обработчик открытия Drawer.
     * Инициализирует загрузку данных и предвыбирает текущие значения.
     */
    const handleOpen = () => {
      void tableStore.loader.initialize();
      tableStore.clearSelection();
      arrVal.forEach(id => {
        tableStore.selectRow(id);
      });
      widgetStore.openSelector();
    };

    /**
     * Обработчик закрытия Drawer.
     */
    const handleCancel = () => {
      widgetStore.closeSelector();
    };

    /**
     * Обработчик сохранения выбранных значений.
     * Обновляет значение поля в модели формы на основе выбранных строк и кеширует записи.
     */
    const handleSave = () => {
      const selectedKeys = tableStore.getSelectedKeys();
      const tableData = tableStore.loader.resp?.data || [];
      const selectedEntries = selectedKeys
        .map(id => {
          // Ищем запись в данных таблицы
          const entry = tableData.find(e => String(e.id) === String(id));
          return entry || null;
        })
        .filter(Boolean) as typeof tableData;

      if (selectedEntries.length > 0) {
        if (schema.cardinality === 'many') {
          widgetStore.handleSelect(selectedEntries);
        } else {
          widgetStore.handleSelect(selectedEntries[0]);
        }
      } else {
        widgetStore.setEntry(null);
        widgetStore.closeSelector();
      }
    };

    const options = Object.entries(widgetStore.entryInfo).map(([entryId, entryData], index) => {
      const error = model.errorFor(pathToString([...namePath, index]));
      const label = `${entryData.title} | ${entryData.post_type.name}`;
      return {
        label: error ? <span className="text-red-500">{label}</span> : label,
        value: String(entryId),
      };
    });

    return (
      <>
        <FormField model={model} namePath={namePath} componentConfig={componentConfig}>
          <Select
            open={false}
            allowClear
            value={value}
            style={{ width: '100%' }}
            mode="tags"
            onClick={handleOpen}
            placeholder={refFieldConstants.inputPlaceholder}
            className="cursor-pointer"
            options={options}
            onDeselect={v => widgetStore.removeEntry(v)}
            onClear={() => widgetStore.setEntry(null)}
          />
        </FormField>

        <Drawer
          open={widgetStore.selectorOpen}
          onClose={handleCancel}
          size="large"
          title={refFieldConstants.drawerTitle}
          extra={
            <Space>
              <Button onClick={handleCancel}>{refFieldConstants.cancelButtonText}</Button>
              <Button type="primary" onClick={handleSave}>
                {refFieldConstants.saveButtonText}
              </Button>
            </Space>
          }
        >
          <PaginatedTable
            store={tableStore}
            columns={refFieldColumns}
            selectionType={selectionType}
            emptyText={refFieldConstants.emptyText}
          />
        </Drawer>
      </>
    );
  }
);
