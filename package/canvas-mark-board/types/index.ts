/** 画布配置 */
export interface IMarkBoardConfig {
  lineWidth?: number;
  view: string;
  drawColor?: string;
  fillColor?: string;
  /** 基本用不到，删除 */
  // showIndex?: boolean;
  showLabel?: boolean;
  disableZoom?: boolean;
  disableMove?: boolean;
}

/**画线类型 */
export type IMarkBoardDrawType =
  | "rect"
  | "polygon"
  | "circle"
  | "ellipse"
  | "line"
  | "polyline"
  | "line_arrow"
  | "";

export interface IObjectLabelData {
  label?: string;
  color?: string;
}

export interface IObjectCompleteHandle {
  ok(labelData: IObjectLabelData): void;
  err(): void;
}

export interface IMarkObjectJSON {
  index: number;
  label: string;
  color?: string;
  type: IMarkBoardDrawType;
  pointList: IPointData[];
}

export interface IMarkObjectInfo {
  id: string;
  label: string;
  select: boolean;
  pointList: IPointData[];
  type: IMarkBoardDrawType;
}

export type IMarkObjectId = string;

export interface IPointData {
  x: number;
  y: number;
}
export interface IMatrixData {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

export interface ICanvasMarkBoard extends IEventer {
  t: IMatrixData;
  img: HTMLImageElement;
  view: HTMLElement;
  viewDomInfo: DOMRect;
  ctx: CanvasRenderingContext2D;
  regionCtx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  regionCanvas: HTMLCanvasElement;
  lastMovePoint: IPointData;
  renderGroup: any[];
  init: (config: any) => void;
  createCanvas: () => HTMLCanvasElement;
  clearCanvas: (ctx: CanvasRenderingContext2D) => void;
  render: IFunction;
  destroy: IFunction;
  imgTrans: IFunction;
  getDrawMark: (
    event: "boxMousedown" | "boxMousemove" | "boxMouseup",
    point: IPointData
  ) => void;
  transfrom: () => void;
  setLayout: (img: HTMLImageElement) => void;
  setBackground: (path: string) => Promise<unknown>;
  initLayout: {
    zoom: number;
    offsetx: number;
    offsety: number;
    width: number;
    height: number;
  };
  appMousemove: (e: MouseEvent) => void;
  appMousedown: (e: MouseEvent) => void;
  appMouseup: (e: MouseEvent) => void;
  appWheel: (e: WheelEvent) => void;
  appDblclick: (e: MouseEvent) => void;
  windowKeydown: (e: KeyboardEvent) => void;
  windowKeyup: (e: KeyboardEvent) => void;
}
export interface IObject {
  [name: string]: any;
}
export interface IFunction {
  (...arg: any): any;
}

/**
 * event
 */

export interface IEventer {
  _events: IObject;
  on: (type: string, listener: IEventListener) => void;
  on_: (
    type: string,
    listener: IEventListener,
    bind?: IObject
  ) => IEventListenerId;
  off: (type: string, listener: IFunction) => void;
  off_: (id: IEventListenerId | IEventListenerId[]) => void;
  emit: (e: any, ...args: any[]) => void;
}

export type IEventListener = IFunction;
export interface IEventListenerOptions {
  capture?: boolean;
  once?: boolean;
}
export interface IEventListenerId {
  type: string;
  listener: IEventListener;
}
