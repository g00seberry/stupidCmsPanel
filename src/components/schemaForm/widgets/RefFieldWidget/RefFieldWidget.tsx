import { PaginatedTable } from '@/components/PaginatedTable';
import { zPatRefConstraints } from '@/types/path/pathConstraints';
import { getValueByPath } from '@/utils/pathUtils';
import { Button, Drawer, Select, Space } from 'antd';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import { useMemo, useState } from 'react';
import { FormField } from '../common/FormField';
import { refFieldColumns } from './RefFieldWidget.columns';
import { refFieldConstants } from './RefFieldWidget.constants';
import { createRefFieldStore } from './RefFieldWidget.store';
import type { RefFieldWidgetProps } from './RefFieldWidget.types';
import { getDisplayValue, getSelectionType, normalizeEntryIds } from './RefFieldWidget.utils';

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
    const value = getValueByPath(model.values, namePath);
    const safeValue = useMemo(() => {
      const sv = Array.isArray(value) ? value : [value];
      return sv.filter(Boolean).map(String);
    }, [value]);

    const [drawerOpen, setDrawerOpen] = useState(false);

    // Извлекаем constraints для ref-поля
    const namePathKey = JSON.stringify(namePath);
    const constraints = useMemo(() => {
      const constraintsData = model.getConstraints(namePath);
      const parseResult = zPatRefConstraints.nullish().safeParse(constraintsData);

      if (!parseResult.success) {
        return null;
      }

      return parseResult.data;
    }, [model, namePathKey]);

    // Если constraints не найдены или невалидны, не рендерим компонент
    if (!constraints) {
      return null;
    }

    const allowedPostTypeIds = constraints.allowed_post_type_ids ?? [];
    const selectionType = getSelectionType(schema.cardinality);

    // Создаём и мемоизируем store для пагинированной таблицы
    const allowedPostTypeIdsKey = JSON.stringify(allowedPostTypeIds);
    const tableStore = useMemo(() => {
      return createRefFieldStore(allowedPostTypeIds);
    }, [allowedPostTypeIdsKey]);
    const options = safeValue.map(v => ({
      label: getDisplayValue(v, model, tableStore.loader.resp?.data || []),
      value: String(v),
    }));
    /**
     * Обработчик открытия Drawer.
     * Инициализирует загрузку данных и предвыбирает текущие значения.
     */
    const handleOpen = () => {
      void tableStore.loader.initialize();
      tableStore.clearSelection();
      const entryIds = normalizeEntryIds(value);
      entryIds.forEach(id => {
        tableStore.selectRow(id);
      });
      setDrawerOpen(true);
    };

    /**
     * Обработчик закрытия Drawer.
     */
    const handleCancel = () => {
      setDrawerOpen(false);
    };

    /**
     * Обработчик сохранения выбранных значений.
     * Обновляет значение поля в модели формы на основе выбранных строк.
     */
    const handleSave = () => {
      const selectedKeys = tableStore.getSelectedKeys();
      const newValue = schema.cardinality === 'many' ? selectedKeys : selectedKeys[0];
      model.setValue(namePath, newValue);
      setDrawerOpen(false);
    };
    return (
      <>
        <FormField model={model} namePath={namePath} componentConfig={componentConfig}>
          <Select
            open={false}
            allowClear
            value={safeValue}
            style={{ width: '100%' }}
            mode={selectionType === 'checkbox' ? 'tags' : undefined}
            maxTagCount="responsive"
            onClick={handleOpen}
            placeholder={refFieldConstants.inputPlaceholder}
            className="cursor-pointer"
            options={options}
          />
        </FormField>

        <Drawer
          open={drawerOpen}
          onClose={handleCancel}
          width={refFieldConstants.drawerWidth}
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
