import { makeAutoObservable } from 'mobx';

export type ContextMenuPosition = { x: number; y: number };

/**
 * Контекст контекстного меню узла.
 * Содержит информацию о выбранном узле и позиции меню.
 */
export type NodeMenuCtx = {
  /** ID узла, для которого открыто контекстное меню. `null` если меню закрыто. */
  nodeId: number | null;
  /** Позиция контекстного меню узла. `null` если меню закрыто. */
  position: ContextMenuPosition | null;
};

/**
 * Состояние контекстного меню.
 * Управляет открытием/закрытием контекстного меню и его позицией.
 */
export class ContextMenuState {
  ctx: NodeMenuCtx = {
    nodeId: null,
    position: null,
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  openForNode(nodeId: number, position: ContextMenuPosition) {
    this.ctx.nodeId = nodeId;
    this.ctx.position = position;
  }

  openForPane(position: ContextMenuPosition) {
    this.ctx.nodeId = null;
    this.ctx.position = position;
  }

  close() {
    this.ctx.nodeId = null;
    this.ctx.position = null;
  }

  get isOpen() {
    return this.ctx.position !== null;
  }
}

