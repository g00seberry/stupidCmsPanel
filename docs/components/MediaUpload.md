# MediaUpload

Компонент загрузки медиа-файлов.
Поддерживает выбор файлов и загрузку по кнопке.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | :--: | --- | --- |
| `config` | `{ allowed_mimes: string[]; max_upload_mb: number; image_variants: Record<string, { max: number; format: string \| null; quality: number \| null; }>; } \| null` | ✓ | `` | Конфигурация системы медиа-файлов. |
| `disabled` | `boolean \| undefined` |  | `false` | Флаг отключения компонента. |
| `mode` | `enum` |  | `dragger` | Режим отображения: 'button' (кнопка) или 'dragger' (drag-and-drop). По умолчанию: 'dragger'. |
| `onAllComplete` | `(() => void) \| undefined` |  | `` | Обработчик завершения всех загрузок (когда все файлы завершены - успешно или с ошибкой). |
| `onError` | `((error: Error, file: File) => void) \| undefined` |  | `` | Обработчик ошибки загрузки. |
| `onSuccess` | `((media: { id: string; name: string; ext: string; mime: string; size_bytes: number; title: string \| null; alt: string \| null; url: string; created_at: string; updated_at: string; deleted_at: string \| null; kind: "image"; width: number; height: number; preview_urls: { ...; }; } \| { ...; } \| { ...; } \| { ...; }) => vo...` |  | `` | Обработчик успешной загрузки файла. |
| `onUploadingChange` | `((isUploading: boolean) => void) \| undefined` |  | `` | Обработчик изменения состояния загрузки. Вызывается при начале/завершении загрузки. |

**Source:** `C:/Users/dattebayo/Desktop/proj/stupidCmsPanel/src/components/MediaUpload/MediaUpload.tsx`
