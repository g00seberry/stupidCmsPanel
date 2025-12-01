import type React from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

/**
 * Пропсы компонента OutdatedFieldIcon.
 */
type PropsOutdatedFieldIcon = {
  /** Флаг наличия устаревших данных. */
  isOutdated?: boolean;
};

/**
 * Иконка с тултипом для отображения предупреждения об устаревших данных.
 * Используется в полях формы для индикации несоответствия данных текущей схеме.
 * @param props Пропсы компонента.
 * @returns Иконку с тултипом или `null`, если данные не устарели.
 */
export const OutdatedFieldIcon: React.FC<PropsOutdatedFieldIcon> = ({ isOutdated }) => {
  if (!isOutdated) {
    return null;
  }

  return (
    <Tooltip title="Поле содержит устаревшие данные из-за изменения настроек схемы. Исправьте значение перед сохранением.">
      <ExclamationCircleOutlined className="text-orange-500" />
    </Tooltip>
  );
};

