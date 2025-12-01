import type React from 'react';
import { pathToString } from '@/utils/pathUtils';
import type { PathSegment } from '@/utils/pathUtils';
import { FieldError } from '../../FieldError';
import type { FormModel } from '../../FormModel';
import type { ZEditComponent } from '../../ZComponent';
import { OutdatedFieldIcon } from './OutdatedFieldIcon';
import { getFieldLabel } from './getFieldLabel';
import { observer } from 'mobx-react-lite';

type PropsFormField = {
  /** Модель формы для доступа к значениям, ошибкам и операциям. */
  model: FormModel;
  /** Путь к полю в форме (массив сегментов). */
  namePath: PathSegment[];
  /** Конфигурация компонента из ZEditComponent (опционально). */
  componentConfig?: ZEditComponent;
  /** Дочерние элементы (поле ввода и т.д.). */
  children: React.ReactNode;
};

/**
 * Обёртка для поля формы, которая добавляет label и отображение ошибки.
 * Используется для единообразного оформления полей во всех виджетах.
 * Отображает иконку с тултипом, если поле содержит устаревшие данные.
 * Автоматически вычисляет label, ошибку и статус устаревания из модели формы.

 * @param props Пропсы компонента.
 * @returns Обёрнутое поле с label и ошибкой.
 * @example
 * <FormField model={model} namePath={['title']} componentConfig={config}>
 *   <Input />
 * </FormField>
 */
export const FormField: React.FC<PropsFormField> = observer(props => {
  const { children, model, namePath, componentConfig } = props;

  const label = getFieldLabel(componentConfig, namePath);
  const isOutdated = model.isOutdated(namePath);
  const error = model.errorFor(pathToString(namePath));

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <label className="block font-medium">{label}</label>
        <OutdatedFieldIcon isOutdated={isOutdated} />
      </div>
      {children}
      <FieldError error={error} />
    </div>
  );
});
