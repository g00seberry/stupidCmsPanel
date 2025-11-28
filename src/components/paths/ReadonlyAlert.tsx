import { Alert } from 'antd';

/**
 * Пропсы компонента предупреждения о режиме только чтения.
 */
export type PropsReadonlyAlert = {
  /** Исходный Blueprint, из которого встроено поле. */
  sourceBlueprint: { id: number; name: string; code: string };
};

/**
 * Компонент предупреждения о том, что поле доступно только для чтения.
 * Отображается при редактировании встроенных полей из другого Blueprint.
 */
export const ReadonlyAlert: React.FC<PropsReadonlyAlert> = ({ sourceBlueprint }) => {
  return (
    <div>
      <Alert
        message="Поле доступно только для чтения"
        description={
          <div>
            <p>
              Изменения нужно вносить в исходном Blueprint &quot;
              {sourceBlueprint.name}&quot;.
            </p>
            <p className="mt-2">
              Здесь поле заблокировано, потому что управляется составным Blueprint.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Обновите структуру в исходном Blueprint и заново встройте его, чтобы увидеть
              изменения.
            </p>
          </div>
        }
        type="warning"
        showIcon
      />
    </div>
  );
};

