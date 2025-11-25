import { Select } from 'antd';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { listEntries } from '@/api/apiEntries';
import type { ZEntry } from '@/types/entries';
import type { FieldRendererProps } from '../FieldRendererProps';
import { getValueByPath } from '@/utils/pathUtils';

/**
 * Виджет для ссылочных полей (ref).
 * Рендерит Select с загрузкой данных из API.
 * Поддерживает поиск с debounce.
 * @param props Пропсы рендерера поля.
 * @returns Компонент Select для выбора ссылки.
 */
export const RefFieldWidget: React.FC<FieldRendererProps> = observer(({ model, namePath }) => {
  const value = getValueByPath(model.values, namePath);
  const [options, setOptions] = useState<Array<{ label: string; value: number | string }>>([]);
  const [loading, setLoading] = useState(false);

  // Загружаем данные при монтировании
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const params = { per_page: 100 };

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
  }, []);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Поиск с debounce
  const handleSearch = (value: string) => {
    // Очищаем предыдущий timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!value) {
      // Если поиск пустой, загружаем обычные данные
      const loadDefault = async () => {
        setLoading(true);
        try {
          const params = { per_page: 100 };

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
        const params = { per_page: 100, q: value };

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
      onChange={val => model.setValue(namePath, val)}
      showSearch
      loading={loading}
      options={options}
      filterOption={false}
      onSearch={handleSearch}
      style={{ width: '100%' }}
    />
  );
});
