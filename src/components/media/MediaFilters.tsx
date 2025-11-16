import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Space,
  Button,
  Row,
  Col,
} from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { debounce } from '@/utils/debounce';
import { mediaStore } from '@/stores/mediaStore';
import type { ZMediaFilters } from '@/types/media';

const { Option } = Select;

/**
 * Пропсы компонента фильтрации медиафайлов.
 */
export type PropsMediaFilters = {
  /** Текущие фильтры. Если не передан, используется mediaStore.filters. */
  filters?: ZMediaFilters;
  /** Обработчик изменения фильтров. Если не передан, используется mediaStore.setFilters(). */
  onFilterChange?: (filters: ZMediaFilters) => void;
  /** Обработчик сброса фильтров. Если не передан, используется mediaStore.resetFilters(). */
  onReset?: () => void;
};

/**
 * Значения фильтров по умолчанию.
 */
const defaultFilters: ZMediaFilters = {
  page: 1,
  per_page: 15,
  sort: 'created_at',
  order: 'desc',
};

/**
 * Компонент фильтрации медиафайлов.
 * Отображает поля для поиска, фильтрации по типу, MIME-типу, коллекции и сортировки.
 * Использует mediaStore для управления состоянием фильтров.
 * @example
 * <MediaFilters
 *   filters={mediaStore.filters}
 *   onFilterChange={(filters) => mediaStore.setFilters(filters)}
 *   onReset={() => mediaStore.resetFilters()}
 * />
 */
export const MediaFilters: React.FC<PropsMediaFilters> = observer(
  ({ filters, onFilterChange, onReset }) => {
    const [form] = Form.useForm<ZMediaFilters>();
    const [localSearchValue, setLocalSearchValue] = useState<string>(
      filters?.q || mediaStore.filters.q || ''
    );

    const currentFilters = filters || mediaStore.filters;

    // Синхронизация формы с текущими фильтрами
    useEffect(() => {
      form.setFieldsValue(currentFilters);
      setLocalSearchValue(currentFilters.q || '');
    }, [form, currentFilters]);

    /**
     * Debounced функция для поиска с задержкой 300ms.
     */
    const debouncedSearch = useMemo(
      () =>
        debounce<Promise<void>, string>(async (value: string) => {
          const newFilters: ZMediaFilters = {
            ...currentFilters,
            q: value.trim() || undefined,
            page: 1, // Сбрасываем на первую страницу при новом поиске
          };
          if (onFilterChange) {
            onFilterChange(newFilters);
          } else {
            await mediaStore.setFilters(newFilters);
          }
        }),
      [currentFilters, onFilterChange]
    );

    /**
     * Обработчик изменения поискового запроса.
     */
    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalSearchValue(value);
        void debouncedSearch(300, value);
      },
      [debouncedSearch]
    );

    /**
     * Обработчик применения фильтров.
     */
    const handleApply = useCallback(
      (values: ZMediaFilters) => {
        const newFilters: ZMediaFilters = {
          ...values,
          page: 1, // Сбрасываем на первую страницу при изменении фильтров
        };
        if (onFilterChange) {
          onFilterChange(newFilters);
        } else {
          void mediaStore.setFilters(newFilters);
        }
      },
      [onFilterChange]
    );

    /**
     * Обработчик сброса фильтров.
     */
    const handleReset = useCallback(() => {
      form.setFieldsValue(defaultFilters);
      setLocalSearchValue('');
      if (onReset) {
        onReset();
      } else {
        void mediaStore.resetFilters();
      }
    }, [form, onReset]);

    /**
     * Проверяет, есть ли активные фильтры (отличные от значений по умолчанию).
     */
    const hasActiveFilters = useMemo(() => {
      return !!(
        currentFilters.q ||
        currentFilters.kind ||
        currentFilters.mime ||
        currentFilters.collection ||
        currentFilters.deleted ||
        currentFilters.sort !== defaultFilters.sort ||
        currentFilters.order !== defaultFilters.order ||
        currentFilters.per_page !== defaultFilters.per_page
      );
    }, [currentFilters]);

    return (
      <Card title="Фильтры" className="mb-6">
        <Form<ZMediaFilters>
          form={form}
          layout="vertical"
          onFinish={handleApply}
          initialValues={defaultFilters}
        >
          <Row gutter={16}>
            {/* Поиск */}
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Поиск" name="q">
                <Input
                  placeholder="По названию или имени файла"
                  value={localSearchValue}
                  onChange={handleSearchChange}
                  maxLength={255}
                  allowClear
                />
              </Form.Item>
            </Col>

            {/* Тип медиафайла */}
            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item label="Тип" name="kind">
                <Select placeholder="Все типы" allowClear>
                  <Option value="image">Изображение</Option>
                  <Option value="video">Видео</Option>
                  <Option value="audio">Аудио</Option>
                  <Option value="document">Документ</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* MIME-тип */}
            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item label="MIME-тип" name="mime">
                <Input
                  placeholder="Например: image/png"
                  maxLength={120}
                  allowClear
                />
              </Form.Item>
            </Col>

            {/* Коллекция */}
            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item label="Коллекция" name="collection">
                <Input
                  placeholder="Название коллекции"
                  maxLength={64}
                  allowClear
                />
              </Form.Item>
            </Col>

            {/* Управление удалёнными */}
            <Col xs={24} sm={12} md={8} lg={3}>
              <Form.Item label="Удалённые" name="deleted">
                <Select placeholder="Только активные" allowClear>
                  <Option value="with">Включая удалённые</Option>
                  <Option value="only">Только удалённые</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Сортировка */}
            <Col xs={24} sm={12} md={8} lg={3}>
              <Form.Item label="Сортировка" name="sort">
                <Select>
                  <Option value="created_at">По дате</Option>
                  <Option value="size_bytes">По размеру</Option>
                  <Option value="mime">По типу</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Направление сортировки */}
            <Col xs={24} sm={12} md={8} lg={3}>
              <Form.Item label="Направление" name="order">
                <Select>
                  <Option value="desc">По убыванию</Option>
                  <Option value="asc">По возрастанию</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Размер страницы */}
            <Col xs={24} sm={12} md={8} lg={3}>
              <Form.Item label="На странице" name="per_page">
                <Select>
                  <Option value={15}>15</Option>
                  <Option value={25}>25</Option>
                  <Option value={50}>50</Option>
                  <Option value={100}>100</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Применить
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
                disabled={!hasActiveFilters}
              >
                Сбросить
              </Button>
              {hasActiveFilters && (
                <span className="text-sm text-gray-500">
                  Активные фильтры применены
                </span>
              )}
            </Space>
          </Form.Item>
        </Form>
      </Card>
    );
  }
);

