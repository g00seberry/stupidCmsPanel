# MediaPreview

Компонент предпросмотра медиа-файла.
Поддерживает отображение изображений, видео, аудио и документов с соответствующими элементами управления.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | :--: | --- | --- |
| `autoPlay` | `boolean \| undefined` |  | `false` | Автовоспроизведение для видео/аудио. По умолчанию: false. |
| `className` | `string \| undefined` |  | `` | Дополнительный класс для контейнера. |
| `imageVariant` | `enum` |  | `medium` | Размер варианта изображения для отображения. По умолчанию: 'medium'. |
| `media` | `{ id: string; name: string; ext: string; mime: string; size_bytes: number; title: string \| null; alt: string \| null; url: string; created_at: string; updated_at: string; deleted_at: string \| null; kind: "image"; width: number; height: number; preview_urls: { ...; }; } \| { ...; } \| { ...; } \| { ...; }` | ✓ | `` | Медиа-файл для предпросмотра. |
| `showControls` | `boolean \| undefined` |  | `true` | Показывать controls для видео/аудио. По умолчанию: true. |
| `showInfo` | `boolean \| undefined` |  | `false` | Показывать ли информацию о файле. По умолчанию: false. |
| `showOpenButton` | `boolean \| undefined` |  | `true` | Показывать ли кнопку "Открыть файл" для не-изображений. По умолчанию: true. |

**Source:** `C:/Users/dattebayo/Desktop/proj/stupidCmsPanel/src/components/MediaPreview/MediaPreview.tsx`
