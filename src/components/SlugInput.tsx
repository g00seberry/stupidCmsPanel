import { slugify } from '@/api/apiUtils';
import { debounce } from '@/utils/debounce';
import { Input, type InputProps } from 'antd';
import { useCallback, useEffect, useState } from 'react';

const slugifyDebounced = debounce<Promise<string | undefined>, string>(async (name: string) => {
  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    return;
  }
  const result = await slugify(trimmedName);
  return result.base;
});

/**
 * Пропсы компонента поля ввода slug.
 */
export type PropsSlugInput = Omit<InputProps, 'onChange'> & {
  /** Исходное значение для генерации slug. */
  from: string;
  /** Обработчик изменения значения slug. */
  onChange?: (value: string) => void;
  /** Запрещает автоматическую генерацию slug при изменении исходного значения. */
  holdOnChange?: boolean;
};

/**
 * Поле ввода slug с автоматической генерацией из исходного значения через API.
 */
export const SlugInput: React.FC<PropsSlugInput> = ({ from, onChange, holdOnChange, ...props }) => {
  const [manuallyEdited, setManuallyEdited] = useState<boolean>(false);

  const handleChange = useCallback(
    (value: string) => {
      setManuallyEdited(true);
      onChange?.(value);
    },
    [onChange]
  );

  const updateSlug = useCallback(async () => {
    const trimmedName = from.trim();
    if (!trimmedName) {
      return;
    }
    const result = await slugifyDebounced(300, trimmedName);
    if (result) {
      onChange?.(result);
    }
  }, [from, onChange]);

  useEffect(() => {
    if (manuallyEdited || holdOnChange) {
      return;
    }
    void updateSlug();
  }, [from]);

  return <Input {...props} onChange={e => handleChange(e.target.value)} />;
};
