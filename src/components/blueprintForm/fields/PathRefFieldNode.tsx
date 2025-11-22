import { Select } from 'antd';
import type React from 'react';
import { observer } from 'mobx-react-lite';
import type { FieldComponentProps } from './fieldRegistry';
import { isFieldDisabled } from '../utils/fieldNodeUtils';
import { t } from '../utils/i18n';
import { useMemo } from 'react';

/**
 * Компонент поля типа ref (ссылка на другую Entry) для работы с FieldNode.
 * Использует BlueprintFormStore для загрузки и кэширования справочных данных.
 * Поддерживает cardinality: one и many через mode="multiple".
 * Возвращает контрол, который должен быть обёрнут в Form.Item на уровне выше.
 */
export const PathRefFieldNode: React.FC<FieldComponentProps> = observer(
  ({ node, readonly, store }) => {
    if (node.dataType !== 'ref') {
      return null;
    }

    const disabled = isFieldDisabled(node, readonly);

    // Используем дефолтные параметры запроса
    const resource = 'entries';
    const params = { per_page: 100 };

    // Используем store для загрузки данных
    const query = useMemo(() => ({ resource, params }), [resource, params]);
    const { loading, options } = store.getReferenceData(query);

    // Обработчик поиска с debounce
    const handleSearch = useMemo(() => {
      return (value: string) => {
        store.searchReferenceData(query, value);
      };
    }, [store, query]);

    // Для ref используем mode="multiple" вместо CardinalityWrapper, так как Select сам поддерживает множественный выбор
    return (
      <Select
        mode={node.cardinality === 'many' ? 'multiple' : undefined}
        showSearch
        placeholder={t('blueprint.entry.select')}
        loading={loading}
        disabled={disabled}
        onSearch={handleSearch}
        filterOption={false} // Отключаем клиентскую фильтрацию, используем серверный поиск
        options={options}
      />
    );
  }
);
