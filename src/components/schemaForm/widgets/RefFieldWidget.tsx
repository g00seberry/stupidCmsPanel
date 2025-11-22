import { Select } from 'antd';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { listEntries } from '@/api/apiEntries';
import type { ZEntry } from '@/types/entries';
import type { FieldRendererProps } from '../widgetRegistry';

/**
 * Виджет для ссылочных полей (ref).
 * Рендерит Select с загрузкой данных из API.
 * Поддерживает поиск с debounce и кастомизацию через uiProps.
 * @param props Пропсы рендерера поля.
 * @returns Компонент Select для выбора ссылки.
 */
export const RefFieldWidget: React.FC<FieldRendererProps> = ({
  schema,
  namePath,
  value,
  onChange,
  disabled,
  readOnly,
}) => {
  const [options, setOptions] = useState<Array<{ label: string; value: number | string }>>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Загружаем данные при монтировании
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Базовый запрос - можно расширить через uiProps
        const params = schema.uiProps?.post_type
          ? { post_type: schema.uiProps.post_type as string, per_page: 100 }
          : { per_page: 100 };

        const result = await listEntries(params);
        const entries = result.data.map((entry: ZEntry) => ({
          label: entry.title || `Entry #${entry.id}`,
          value: entry.id,
        }));
        setOptions(entries);
      } catch (error) {
        console.error('Ошибка загрузки данных для ref поля:', error);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [schema.uiProps?.post_type]);

  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Поиск с debounce
  const handleSearch = (value: string) => {
    setSearchTerm(value);

    // Очищаем предыдущий timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!value) {
      // Если поиск пустой, загружаем обычные данные
      const loadDefault = async () => {
        setLoading(true);
        try {
          const params: any = { per_page: 100 };
          if (schema.uiProps?.post_type) {
            params.post_type = schema.uiProps.post_type;
          }

          const result = await listEntries(params);
          const entries = result.data.map((entry: ZEntry) => ({
            label: entry.title || `Entry #${entry.id}`,
            value: entry.id,
          }));
          setOptions(entries);
        } catch (error) {
          console.error('Ошибка загрузки данных для ref поля:', error);
        } finally {
          setLoading(false);
        }
      };
      void loadDefault();
      return;
    }

    // Debounce поиска (300ms)
    searchTimeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const params: any = { per_page: 100, q: value };
        if (schema.uiProps?.post_type) {
          params.post_type = schema.uiProps.post_type;
        }

        const result = await listEntries(params);
        const entries = result.data.map((entry: ZEntry) => ({
          label: entry.title || `Entry #${entry.id}`,
          value: entry.id,
        }));
        setOptions(entries);
      } catch (error) {
        console.error('Ошибка поиска для ref поля:', error);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  // Очистка timeout при размонтировании
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Select
      value={value}
      onChange={onChange}
      showSearch
      placeholder={schema.placeholder}
      loading={loading}
      options={options}
      filterOption={false}
      onSearch={handleSearch}
      style={{ width: '100%' }}
      disabled={disabled || readOnly}
      {...schema.uiProps}
    />
  );
};

