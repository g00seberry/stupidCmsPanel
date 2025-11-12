# Детальный план реализации автодокументации

## Обзор проекта

**Текущее состояние:**
- React + TypeScript + Vite приложение
- MobX для управления состоянием
- AntD + Tailwind для UI
- Структура: `src/api/`, `src/components/`, `src/pages/`, `src/stores/`, `src/utils/`, `src/types/`
- Уже настроены: husky, lint-staged, prettier, eslint
- Код содержит JSDoc комментарии (AuthStore, SlugInput)

**Цель:** Реализовать систему автодокументации, которая никогда не протухает.

---

## Этап 1: Установка зависимостей

### 1.1. Установить пакеты для документации

```bash
pnpm add -D vitepress typedoc typedoc-plugin-markdown \
  react-docgen-typescript fs-extra globby tsx
```

**Зависимости:**
- `vitepress` — генератор статической документации
- `typedoc` + `typedoc-plugin-markdown` — генерация API из TypeScript
- `react-docgen-typescript` — извлечение props из React компонентов
- `fs-extra` — расширенные операции с файловой системой
- `globby` — поиск файлов по паттернам
- `tsx` — запуск TypeScript скриптов напрямую

### 1.2. Проверить совместимость версий

Убедиться, что версии совместимы с текущим Node.js и TypeScript 5.9.3.

---

## Этап 2: Создание структуры директорий

### 2.1. Создать базовую структуру

```
docs/
├── .vitepress/
│   ├── config.ts
│   └── sidebarFromFs.ts
├── index.md
├── guides/
│   └── index.md
├── api/          # автоген (не правим вручную)
├── components/   # автоген (не правим вручную)
└── pages/        # автоген (не правим вручную)
```

### 2.2. Добавить в .gitignore (если нужно)

Обычно `docs/api/`, `docs/components/`, `docs/pages/` должны быть в git (они генерируются), но можно добавить исключения для временных файлов.

---

## Этап 3: Настройка VitePress

### 3.1. Создать `docs/.vitepress/config.ts`

**Задачи:**
- Настроить базовые параметры (title, description)
- Настроить навигацию (nav)
- Настроить авто-сайдбар через `sidebarFromFs`
- Включить локальный поиск
- Настроить outline для заголовков

**Особенности:**
- `srcDir: '../'` — чтобы VitePress видел все файлы в `docs/`
- Использовать `await sidebarFromFs()` для динамической генерации сайдбара

### 3.2. Создать `docs/.vitepress/sidebarFromFs.ts`

**Функционал:**
- Функция `sidebarFromFs(entries: Entry[])` — строит сайдбар из файловой структуры
- Функция `firstHeading(file: string)` — извлекает первый заголовок из MD файла
- Группировка по директориям
- Сортировка по алфавиту

**Логика:**
1. Найти все `.md` файлы в указанных директориях
2. Извлечь заголовок из первого `#` в файле или использовать имя файла
3. Сгруппировать по директориям
4. Вернуть структуру для VitePress sidebar

---

## Этап 4: Настройка TypeDoc для API документации

### 4.1. Создать `typedoc.json`

**Параметры:**
- `entryPoints`: `["src/index.ts", "src/**/*.ts", "src/**/*.tsx"]` (или только нужные)
- `exclude`: `["**/*.test.*", "**/__mocks__/**", "**/node_modules/**"]`
- `plugin`: `["typedoc-plugin-markdown"]`
- `excludePrivate`: `true`
- `excludeInternal`: `true`
- `readme`: `"none"` (или путь к README, если есть)
- `hideBreadcrumbs`: `true`
- `categorizeByGroup`: `false`
- `tsconfig`: `"tsconfig.json"`
- `out`: `"docs/api"`

**Особенности проекта:**
- Учесть алиас `@/*` в tsconfig (TypeDoc должен автоматически подхватить из tsconfig.json)
- Исключить тестовые файлы (`src/test/**`)
- Настроить формат вывода (Markdown)
- Документировать: API функции (`src/api/`), сторы (`src/AuthStore.ts`, `src/pages/**/*Store.ts`), утилиты (`src/utils/`), типы (`src/types/`)

### 4.2. Протестировать генерацию

```bash
pnpm typedoc --options typedoc.json
```

Проверить, что:
- Генерируются файлы в `docs/api/`
- JSDoc комментарии извлекаются корректно
- Типы и интерфейсы документируются

---

## Этап 5: Генерация документации компонентов

### 5.1. Создать `scripts/gen-components-docs.ts`

**Функционал:**
1. Использовать `react-docgen-typescript` для парсинга компонентов
2. Найти все компоненты:
   - `src/components/**/*.{ts,tsx}`
   - `src/layouts/components/**/*.{ts,tsx}`
3. Для каждого компонента:
   - Извлечь `displayName`, `description`, `props`
   - Сгенерировать таблицу props (Prop | Type | Required | Default | Description)
   - Добавить ссылку на исходный файл
4. Создать `index.md` со списком всех компонентов

**Особенности:**
- Обработать `Props{ComponentName}` типы (например, `PropsSlugInput`)
- Экранировать Markdown символы (`|`, `\`, и т.д.)
- Учесть `defaultProps` и `defaultValue`
- Исключить пропсы из `node_modules`
- Учесть компоненты в `src/layouts/components/` (MainHeader, MainSidebar)

**Структура выходного файла:**
```markdown
# ComponentName

Описание компонента

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | :--: | --- | --- |
| propName | `string` | ✓ | `''` | Описание |

**Source:** `src/components/ComponentName.tsx`
```

### 5.2. Учесть особенности проекта

- Компоненты находятся в:
  - `src/components/` (например, `SlugInput.tsx`)
  - `src/layouts/components/` (например, `MainHeader.tsx`, `MainSidebar.tsx`)
- Использовать алиас `@/*` в tsconfig для парсера
- Обработать компоненты с JSDoc комментариями (уже есть в `SlugInput.tsx`)
- Учесть типы пропсов вида `Props{ComponentName}` (например, `PropsSlugInput`)

---

## Этап 6: Генерация карты страниц

### 6.1. Создать `scripts/gen-pages-docs.ts`

**Функционал:**
1. Найти все файлы: `src/pages/**/*.{tsx,ts,md,mdx}`
2. Построить дерево по директориям
3. Сгенерировать `index.md` с группировкой по папкам

**Структура выходного файла:**
```markdown
# Страницы

Автосгенерировано из `src/pages`.

## root
- `LoginPage.tsx`
- `PostTypesPage.tsx`

## EntriesListPage
- `EntriesListPage.tsx`
- `entriesListPage.module.less`
```

### 6.2. Дополнительно: парсинг роутинга (опционально)

Если нужно, можно распарсить `src/routes.tsx` и добавить информацию о путях:
- Извлечь пути из `PageUrl` (используется в `routes.tsx`)
- Связать страницы с роутами
- Показать иерархию навигации

**Текущая структура страниц:**
- `LoginPage/` — страница входа (`/login`)
- `EntriesListPage/` — список записей (`/entries`)
- `PostTypesPage/` — список типов контента (`/content-types`)
- `PostTypeEditorPage/` — редактор типа контента (`/content-types/:slug`, с собственным стором `PostTypeEditorStore.ts`)

**Дополнительная информация:**
- Роуты определены в `src/routes.tsx`
- URL константы в `src/PageUrl.ts` (можно использовать для связи страниц с путями)

---

## Этап 7: Настройка npm-скриптов

### 7.1. Добавить скрипты в `package.json`

```json
{
  "scripts": {
    "docs:clean": "rimraf docs/api docs/components docs/pages",
    "docs:gen:api": "typedoc --options typedoc.json",
    "docs:gen:components": "tsx scripts/gen-components-docs.ts",
    "docs:gen:pages": "tsx scripts/gen-pages-docs.ts",
    "docs:gen": "pnpm docs:clean && pnpm docs:gen:api && pnpm docs:gen:components && pnpm docs:gen:pages",
    "docs:dev": "vitepress dev docs",
    "docs:build": "pnpm docs:gen && vitepress build docs",
    "docs:preview": "vitepress preview docs"
  }
}
```

**Примечания:**
- `rimraf` может потребоваться установить отдельно или использовать `rm -rf` (на Windows через `fs-extra`)
- Скрипты должны работать на Windows (использовать `tsx` вместо `node`)

### 7.2. Альтернатива для Windows

Если `rimraf` не работает, использовать:
```json
"docs:clean": "node -e \"require('fs-extra').removeSync('docs/api'); require('fs-extra').removeSync('docs/components'); require('fs-extra').removeSync('docs/pages')\""
```

Или создать отдельный скрипт `scripts/clean-docs.ts`.

---

## Этап 8: Настройка pre-commit хука

### 8.1. Обновить `lint-staged` в `package.json`

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "npm run lint"
    ],
    "src/**/*.{ts,tsx}": [
      "pnpm docs:gen",
      "git add docs"
    ]
  }
}
```

**Логика:**
- При изменении файлов в `src/` запускать генерацию документации
- Автоматически добавлять изменённые файлы в `docs/` в staging

### 8.2. Проверить настройку husky

Убедиться, что `.husky/pre-commit` содержит:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```

Если husky не инициализирован:
```bash
pnpm dlx husky init
```

---

## Этап 9: Создание базовых файлов документации

### 9.1. Создать `docs/index.md`

**Содержание:**
- Заголовок проекта
- Краткое описание системы документации
- Ссылки на разделы: Гайды, API, Компоненты, Страницы
- Инструкция по запуску локального сервера документации

### 9.2. Создать `docs/guides/index.md`

**Содержание:**
- Описание раздела "Гайды"
- Инструкция, что здесь хранить (процессы, архитектура, ADR, HowTo)
- Пример структуры (можно добавить позже)

### 9.3. Добавить `.gitkeep` в автогенерируемые папки (опционально)

Чтобы папки `docs/api/`, `docs/components/`, `docs/pages/` были в git даже когда пустые.

---

## Этап 10: Настройка CI для проверки актуальности

### 10.1. Создать `.github/workflows/docs.yml`

**Задачи:**
1. Проверить код
2. Установить зависимости
3. Сгенерировать документацию
4. Проверить, что документация актуальна (нет изменений после генерации)
5. (Опционально) Собрать и задеплоить на GitHub Pages

**Логика проверки:**
```bash
git add -N docs
git diff --exit-code -- docs || \
  (echo "::error::Docs are stale. Run 'pnpm docs:gen' and commit changes." && exit 1)
```

**Особенности:**
- Использовать `fetch-depth: 0` для полной истории
- Использовать `corepack enable` для pnpm
- Запускать на push и pull_request

---

## Этап 11: Тестирование и доработка

### 11.1. Локальное тестирование

1. Запустить генерацию: `pnpm docs:gen`
2. Проверить, что файлы созданы корректно
3. Запустить dev-сервер: `pnpm docs:dev`
4. Проверить навигацию, сайдбар, поиск
5. Проверить форматирование Markdown

### 11.2. Тестирование pre-commit

1. Внести изменение в `src/components/SlugInput.tsx`
2. Попытаться закоммитить
3. Проверить, что документация сгенерировалась автоматически
4. Проверить, что изменения в `docs/` добавлены в staging

### 11.3. Тестирование CI

1. Создать PR с изменениями в коде
2. Проверить, что CI запускается
3. Проверить, что проверка актуальности документации работает

### 11.4. Доработка по результатам

- Исправить проблемы с путями (Windows vs Unix)
- Настроить исключения для файлов, которые не нужно документировать
- Улучшить форматирование генерируемых файлов
- Добавить примеры использования в документацию компонентов (если нужно)

---

## Этап 12: Документирование процесса (опционально)

### 12.1. Добавить раздел в `docs/guides/`

Создать `docs/guides/documentation.md` с описанием:
- Как работает система автодокументации
- Как добавлять JSDoc комментарии
- Как запускать генерацию вручную
- Как добавлять ручные гайды

---

## Чеклист готовности

- [ ] Все зависимости установлены
- [ ] Структура `docs/` создана
- [ ] VitePress настроен и работает локально
- [ ] TypeDoc генерирует API документацию
- [ ] Скрипт генерации компонентов работает
- [ ] Скрипт генерации страниц работает
- [ ] npm-скрипты добавлены и работают
- [ ] pre-commit хук генерирует документацию автоматически
- [ ] CI проверяет актуальность документации
- [ ] Базовая документация создана
- [ ] Локальное тестирование пройдено
- [ ] CI тестирование пройдено

---

## Потенциальные проблемы и решения

### Проблема 1: TypeDoc не видит алиасы `@/*`

**Решение:** Убедиться, что `tsconfig.json` правильно настроен, или использовать `paths` в конфиге TypeDoc.

### Проблема 2: react-docgen-typescript не парсит компоненты

**Решение:** Проверить, что компоненты экспортируются как `export const ComponentName`, и что типы пропсов явные.

### Проблема 3: Проблемы с путями на Windows

**Решение:** Использовать `path.join()` и `path.sep` вместо жёстко заданных разделителей.

### Проблема 4: VitePress не видит файлы

**Решение:** Проверить `srcDir` в конфиге и пути в `sidebarFromFs`.

### Проблема 5: CI падает из-за различий в форматировании

**Решение:** Запускать `prettier` на сгенерированных файлах или настроить единое форматирование.

---

## Следующие шаги после реализации

1. Добавить JSDoc комментарии в существующий код (API, сторы, утилиты)
2. Создать первые гайды в `docs/guides/`
3. Настроить деплой документации на GitHub Pages (если нужно)
4. Добавить примеры использования в документацию компонентов
5. Настроить кастомные темы/стили для VitePress (если нужно)

