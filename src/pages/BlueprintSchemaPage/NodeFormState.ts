import { makeAutoObservable } from 'mobx';
import type { NodeFormMode } from './BlueprintSchemaViewModel';

/**
 * Режим открытого модального окна.
 */
export type ModalMode = 'embed' | 'node';

/**
 * Состояние формы создания/редактирования узла.
 * Управляет открытием/закрытием формы и её режимом.
 */
export class NodeFormState {
  modeOpen: ModalMode | null = null;
  mode: NodeFormMode = 'create';
  parentId: number | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setModeOpen(modeOpen: ModalMode | null) {
    this.modeOpen = modeOpen;
  }

  setMode(mode: NodeFormMode) {
    this.mode = mode;
  }

  setParentId(parentId: number | null) {
    this.parentId = parentId;
  }

  openForm(mode: NodeFormMode, parentId: number | null) {
    this.mode = mode;
    this.parentId = parentId;
    this.modeOpen = mode === 'embed' ? 'embed' : 'node';
  }

  close() {
    this.modeOpen = null;
    this.mode = 'create';
    this.parentId = null;
  }
}
