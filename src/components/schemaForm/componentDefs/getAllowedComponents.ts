import type { ZEditComponent } from './ZComponent';

const componentsOptionsRegistry: Record<
  string,
  Record<'one' | 'many', ZEditComponent['name'][]>
> = {
  string: {
    one: ['inputText'],
    many: ['inputText'],
  },
  number: {
    one: ['inputNumber'],
    many: ['inputNumber'],
  },
};

export const getAllowedComponents = (dataType: string, cardinality: 'one' | 'many') => {
  return componentsOptionsRegistry[dataType][cardinality];
};
