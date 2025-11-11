/**
 * Объединяет переданные CSS-классы в одну строку.
 * Отфильтровывает ложные значения, чтобы исключить неожиданные пробелы.
 * @param classes Перечень классов и условных значений.
 * @returns Единую строку классов.
 */
export const joinClassNames = (...classes: Array<string | false | undefined>): string =>
  classes.filter(Boolean).join(' ');
