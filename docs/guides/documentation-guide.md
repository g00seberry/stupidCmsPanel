# Руководство по документированию кода

## Быстрая шпаргалка

### Минимальный JSDoc для функции

```typescript
/**
 * Краткое описание функции.
 * @param param Описание параметра.
 * @returns Описание возвращаемого значения.
 */
export const functionName = (param: string): string => {
  // ...
};
```

### Минимальный JSDoc для класса

```typescript
/**
 * Описание назначения класса.
 */
export class ClassName {
  /**
   * Описание свойства.
   */
  property: string = '';

  /**
   * Описание метода.
   * @param param Описание параметра.
   */
  method(param: string): void {
    // ...
  }
}
```

### Минимальный JSDoc для типа

```typescript
/**
 * Описание типа.
 * @example
 * const example: TypeName = { field: 'value' };
 */
export type TypeName = {
  /** Описание поля. */
  field: string;
};
```

## Команды для работы с документацией

```bash
# Генерация всей документации
npm run docs:gen

# Запуск dev-сервера
npm run docs:dev

# Сборка для production
npm run docs:build
```

## Где искать документацию

- **API функции**: `docs/api/` или `http://localhost:5174/api/`
- **Компоненты**: `docs/components/` или `http://localhost:5174/components/`
- **Типы**: `docs/api/types/` или через поиск в документации
- **Сторы**: `docs/api/` → ищите `*Store`

## Чеклист перед коммитом

- [ ] Новый код задокументирован
- [ ] Изменённый код имеет обновлённую документацию
- [ ] Запущена генерация: `npm run docs:gen`
- [ ] Проверена документация в браузере

## Подробные правила

См. `.cursor/rules/documentation.mdc` для полных правил документирования.
