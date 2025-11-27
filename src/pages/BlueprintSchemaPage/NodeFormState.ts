import { makeAutoObservable } from 'mobx';
import type { NodeFormMode } from './BlueprintSchemaViewModel';

/**
 * Состояние формы создания/редактирования узла.
 * Управляет открытием/закрытием формы и её режимом.
 */
export class NodeFormState {
  open = false;
  mode: NodeFormMode = 'create';
  parentId: number | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setOpen(open: boolean) {
    this.open = open;
  }

  setMode(mode: NodeFormMode) {
    this.mode = mode;
  }

  setParentId(parentId: number | null) {
    this.parentId = parentId;
  }

  openForm(mode: NodeFormMode, parentId: number | null) {
    this.open = true;
    this.mode = mode;
    this.parentId = parentId;
  }

  close() {
    this.open = false;
    this.mode = 'create';
    this.parentId = null;
  }
}

