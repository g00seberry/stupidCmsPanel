import { slugify } from '@/api/apiUtils';
import { debounce } from '@/utils/debounce';
import { Input, type InputProps } from 'antd';
import { useEffect, useState } from 'react';

const slugifyDebounced = debounce<Promise<string | undefined>, string>(async (name: string) => {
  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    return;
  }
  const result = await slugify(trimmedName);
  return result.base;
});

export type PropsSlugInput = Omit<InputProps, 'onChange'> & {
  from: string;
  onChange?: (value: string) => void;
  holdOnChange?: boolean;
};

/**
 * Поле ввода slug с автоматической генерацией из исходного значения через API.
 */
export const SlugInput: React.FC<PropsSlugInput> = ({ from, onChange, holdOnChange, ...props }) => {
  const [manuallyEdited, setManuallyEdited] = useState<boolean>(false);

  const handleChange = (value: string) => {
    setManuallyEdited(true);
    onChange?.(value);
  };

  const updateSlug = async () => {
    const result = await slugifyDebounced(300, from);
    if (result) {
      onChange?.(result);
    }
  };

  useEffect(() => {
    const trimmedName = from.trim();
    if (!trimmedName || manuallyEdited || holdOnChange) {
      return;
    }
    void updateSlug();
  }, [from]);

  return <Input {...props} onChange={e => handleChange(e.target.value)} />;
};
