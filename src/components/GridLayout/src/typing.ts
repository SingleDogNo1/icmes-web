export type LayoutItem = {
  i?: string;
  x?: number;
  y?: number;
  h?: number;
  w?: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  static?: boolean;
  moved?: boolean;
  isDraggable?: boolean;
  isResizable?: boolean;
};
export type Layout = Array<LayoutItem>;

export interface ItemState {
  cols: number;
  containerWidth: number;
  rowHeight: number;
  margin: number[];
  maxRows: number;
  draggable: null | boolean;
  resizable: null | boolean;
  useCssTransforms: boolean;
  isDragging: boolean;
  dragging: null | { top: number; left: number };
  isResizing: boolean;
  resizing: null | { width: number; height: number };
  lastX: number;
  lastY: number;
  lastW: number;
  lastH: number;
  style: { [index: string]: string };
  rtl: boolean;
  dragEventSet: boolean;
  resizeEventSet: boolean;
  previousW: Nullable<number>;
  previousH: Nullable<number>;
  previousX: Nullable<number>;
  previousY: Nullable<number>;
  innerX: number;
  innerY: number;
  innerW: number;
  innerH: number;
}

export interface ItemEvent {
  eventType: string;
  i: number | string;
  x: number;
  y: number;
  h: number;
  w: number;
}

export type ItemEventType = {
  updateWidth: string;
  compact: string;
  setDraggable: string;
  setResizable: string;
  setRowHeight: string;
  setMaxRows: string;
  directionchange: string;
  setColNum: string;
  resizeEvent: ItemEvent;
  dragEvent: ItemEvent;
};
