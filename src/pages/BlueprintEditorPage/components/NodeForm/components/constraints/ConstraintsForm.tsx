import type { ZDataType } from '@/types/path/path';
import { type ZPathConstraints } from '@/types/path/pathConstraints';
import { MediaConstraintsForm } from './MediaConstraintsForm';
import { MediaConstraintsStore } from './MediaConstraintsStore';
import { RefConstraintsForm } from './RefConstraintsForm';
import { RefConstraintsStore } from './RefConstraintsStore';

type ConstraintsFormProps = {
  value?: ZPathConstraints | null;
  dataType?: ZDataType;
  disabled?: boolean;
};

/**
 * Компонент формы для редактирования ограничений (constraints) поля Path.
 * Поддерживает два типа ограничений:
 * - ref: выбор разрешенных типов контента (post types)
 * - media: выбор разрешенных MIME типов файлов
 */
export const ConstraintsForm: React.FC<ConstraintsFormProps> = ({ dataType, disabled = false }) => {
  const buildConstraints = () => {
    switch (dataType) {
      case 'ref':
        const refStore = new RefConstraintsStore();
        refStore.init();
        return <RefConstraintsForm store={refStore} disabled={disabled} />;
      case 'media':
        const mediaStore = new MediaConstraintsStore();
        mediaStore.init();
        return <MediaConstraintsForm store={mediaStore} disabled={disabled} />;
      default:
        return null;
    }
  };
  return buildConstraints();
};
