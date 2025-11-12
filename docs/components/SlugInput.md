# SlugInput

Поле ввода slug с автоматической генерацией из исходного значения через API.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | :--: | --- | --- |
| `from` | `string` | ✓ | `` | Исходное значение для генерации slug. |
| `holdOnChange` | `boolean \| undefined` |  | `` | Запрещает автоматическую генерацию slug при изменении исходного значения. |
| `onChange` | `((value: string) => void) \| undefined` |  | `` | Обработчик изменения значения slug. |

**Source:** `src/components/SlugInput.tsx`
