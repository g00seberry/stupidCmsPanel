import { Button, Space } from 'antd';
import { Maximize2, Layout, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

/**
 * Пропсы компонента панели управления графом.
 */
export type PropsGraphControls = {
  /** Обработчик центрирования графа. */
  onCenter?: () => void;
  /** Обработчик автоматической компоновки графа. */
  onAutoLayout?: () => void;
  /** Обработчик увеличения масштаба. */
  onZoomIn?: () => void;
  /** Обработчик уменьшения масштаба. */
  onZoomOut?: () => void;
  /** Обработчик сброса масштаба. */
  onResetZoom?: () => void;
  /** Текущий уровень масштаба (для отображения). */
  zoomLevel?: number;
};

/**
 * Панель управления визуальным редактором графа.
 * Содержит кнопки для управления графом: добавление узлов, навигация, масштабирование.
 */
export const GraphControls: React.FC<PropsGraphControls> = ({
  onCenter,
  onAutoLayout,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  zoomLevel,
}) => {
  return (
    <div className="flex items-center justify-end p-4 border-b bg-card">
      <Space>
        {onCenter && (
          <Button icon={<Maximize2 className="w-4 h-4" />} onClick={onCenter} title="Центрировать">
            Центр
          </Button>
        )}
        {onAutoLayout && (
          <Button
            icon={<Layout className="w-4 h-4" />}
            onClick={onAutoLayout}
            title="Авто-компоновка"
          >
            Авто
          </Button>
        )}
        {onZoomIn && (
          <Button icon={<ZoomIn className="w-4 h-4" />} onClick={onZoomIn} title="Увеличить" />
        )}
        {onZoomOut && (
          <Button icon={<ZoomOut className="w-4 h-4" />} onClick={onZoomOut} title="Уменьшить" />
        )}
        {onResetZoom && (
          <Button
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={onResetZoom}
            title="Сбросить масштаб"
          >
            {zoomLevel !== undefined ? `${Math.round(zoomLevel * 100)}%` : '100%'}
          </Button>
        )}
      </Space>
    </div>
  );
};
