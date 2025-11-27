import { makeAutoObservable } from 'mobx';

/**
 * Состояние выбора узлов.
 * Управляет выбранным узлом и подсветкой.
 */
export class SelectionState {
  selectedPathId: number | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  select(pathId: number) {
    this.selectedPathId = pathId;
  }

  clear() {
    this.selectedPathId = null;
  }
}

