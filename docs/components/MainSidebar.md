# MainSidebar

Боковая панель навигации административной панели.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | :--: | --- | --- |
| `isActivePath` | `(path: string) => boolean` | ✓ | `` | Проверяет, активен ли указанный путь. @param path Проверяемый путь. @returns Признак активности. |
| `isCollapsed` | `boolean` | ✓ | `` | Флаг свёрнутого состояния сайдбара. |
| `links` | `readonly SidebarLink[]` | ✓ | `` | Ссылки раздела «Управление контентом». |
| `onToggle` | `() => void` | ✓ | `` | Коллбэк переключения ширины сайдбара. |
| `systemLinks` | `readonly SidebarLink[]` | ✓ | `` | Ссылки системного раздела. |

**Source:** `src/layouts/components/MainSidebar.tsx`
