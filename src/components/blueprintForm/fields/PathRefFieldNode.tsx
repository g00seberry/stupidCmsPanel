import { Select } from 'antd';
import type React from 'react';
import type { FieldComponentProps } from './fieldRegistry';
import { isFieldDisabled } from '../utils/fieldNodeUtils';
import { useReferenceData } from '../hooks/useReferenceData';
import { useMemo } from 'react';
import { t } from '../utils/i18n';

/**
 * Компонент поля типа ref (ссылка на другую Entry) для работы с FieldNode.
 * Использует ReferenceDataProvider для загрузки и кэширования справочных данных.
 * Поддерживает cardinality: one и many через mode="multiple".
 * Возвращает контрол, который должен быть обёрнут в Form.Item на уровне выше.
 */
export const PathRefFieldNode: React.FC<FieldComponentProps> = ({ node, readonly }) => {
  if (node.dataType !== 'ref') {
    return null;
  }

  const disabled = isFieldDisabled(node, readonly);

  // Получаем параметры запроса из ui-конфигурации или используем дефолтные
  const refConfig = node.ui?.refConfig as { resource?: string; params?: Record<string, unknown> } | undefined;
  const resource = refConfig?.resource || 'entries';
  const params = refConfig?.params || { per_page: 100 };

  // Используем ReferenceDataProvider для загрузки данных
  const { loading, options, search } = useReferenceData({
    resource,
    params,
  });

  // Обработчик поиска с debounce (уже реализован в useReferenceData)
  const handleSearch = useMemo(() => {
    if (!search) {
      return undefined;
    }
    return (value: string) => {
      search(value);
    };
  }, [search]);

  // Для ref используем mode="multiple" вместо CardinalityWrapper, так как Select сам поддерживает множественный выбор
  return (
    <Select
      mode={node.cardinality === 'many' ? 'multiple' : undefined}
      showSearch
      placeholder={node.ui?.placeholderKey ? t(node.ui.placeholderKey) : t('blueprint.entry.select')}
      loading={loading}
      disabled={disabled}
      onSearch={handleSearch}
      filterOption={false} // Отключаем клиентскую фильтрацию, используем серверный поиск
      options={options}
    />
  );
};

