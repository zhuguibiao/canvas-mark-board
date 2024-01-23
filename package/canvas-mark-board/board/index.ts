import { Eventer } from "../decorator/event";
import { useModule } from "../decorator/rewrite";
import { markMap, MarkObject, MarkObjectType } from "../object/index";
import ClickMarkObject from "../object/clickMark";
import MoveMarkObject from "../object/moveMark";
import * as MarkBoardUtils from "../utils";
const { scaleOfOuter } = MarkBoardUtils.MatrixHelper;

import type {
  ICanvasMarkBoard,
  IMarkBoardConfig,
  IMatrixData,
  IMarkBoardDrawType,
  IPointData,
  IMarkObjectInfo,
  IMarkObjectId,
  IObject,
  IEventListenerId,
  IEventListener,
  IMarkObjectJSON,
  IFunction,
} from "../types";

@useModule(Eventer)
export default class CanvasMarkBoard implements ICanvasMarkBoard {
  static MoveMarkObject = MoveMarkObject;
  static ClickMarkObject = ClickMarkObject;
  static MarkBoardUtils = MarkBoardUtils;

  view!: HTMLElement;
  canvas!: HTMLCanvasElement;
  img!: HTMLImageElement;
  regionCanvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  regionCtx!: CanvasRenderingContext2D;
  config: Omit<IMarkBoardConfig, "view"> = {
    drawColor: "yellow",
    lineWidth: 2,
    fillColor: "rgba(255, 255, 255, 0.3)",
    showIndex: true,
  };
  t: IMatrixData = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
  initLayout = { zoom: 1, offsetx: 0, offsety: 0, width: 0, height: 0 };
  lastMovePoint: IPointData = { x: 0, y: 0 };
  // 平移状态
  moveStatus = false;
  // 鼠标按下
  mouseDown = false;
  // 拖拽状态
  drag = false;
  /** 选中标注对象 */
  selectObject?: MarkObject;
  currentDrawingType: IMarkBoardDrawType = MarkObjectType.NONE;
  markObjectList: MarkObject[] = [];
  renderGroup: any[] = [];
  markMap: any = markMap;
  /** 初始化标注画布 */
  constructor(config: IMarkBoardConfig) {
    this.init(config);
  }
  init(config: IMarkBoardConfig) {
    // 合并配置
    Object.assign(this.config, config || {});
    this.view = document.querySelector(config.view)!;
    this.view.style.overflow = "hidden";
    this.view.style.position = "relative";
    this.view.style.cursor = "default";

    this.canvas = this.createCanvas();
    this.regionCanvas = this.createCanvas();
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.regionCtx = this.regionCanvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    this.view.addEventListener("mousemove", this.appMousemove.bind(this));
    this.view.addEventListener("mousedown", this.appMousedown.bind(this));
    this.view.addEventListener("mouseup", this.appMouseup.bind(this));
    this.view.addEventListener("wheel", this.appWheel.bind(this));
    this.view.addEventListener("dblclick", this.appDblclick.bind(this));
    this.view.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      this.emit("oncontextmenu", this.lastMovePoint);
    });
    this.windowKeydown = this.windowKeydown.bind(this);
    this.windowKeyup = this.windowKeyup.bind(this);
    window.addEventListener("keydown", this.windowKeydown);
    window.addEventListener("keyup", this.windowKeyup);
  }

  register(type: string, markObject: any) {
    if (!type || !markObject) {
      throw new Error(`need type or markObject`);
    }
    this.markMap[type] = markObject;
  }

  get viewDomInfo() {
    return this.view.getBoundingClientRect();
  }
  get lastPoint(): IPointData | null {
    if (!this.lastMovePoint) return null;
    return this.lastMovePoint;
  }

  /** 创建canvas */
  createCanvas() {
    let canvas = document.createElement("canvas");
    canvas.setAttribute(
      "style",
      ` width: ${this.viewDomInfo.width}px;
        height: ${this.viewDomInfo.height}px;
        position: absolute;
        `
    );
    canvas.width = this.viewDomInfo.width;
    canvas.height = this.viewDomInfo.height;
    this.view.appendChild(canvas);

    return canvas;
  }
  /** 清除canvas */
  clearCanvas(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalCompositeOperation = "copy";
    ctx.beginPath();
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.restore();
  }
  /**
   * 清空绘制图形
   */
  clearMarkShapes() {
    this.markObjectList.forEach((item) => {
      item.destory();
      item.render();
    });
    this.markObjectList = [];
    this.render();
    this.emit("onchange");
    this.addObjectData();
  }
  /** 加载初始背景 */
  async setBackground(path: string) {
    return new Promise((resolve) => {
      if (this.img?.src) {
        this.img.src = path;
      } else {
        this.img = new Image();
        this.img.src = path;
        this.img.style.position = "absolute";
        this.img.style.userSelect = "none";
        this.img.style.pointerEvents = "none";
      }
      this.img.onload = () => {
        this.view.insertBefore(this.img, this.canvas);
        this.setLayout(this.img);
        resolve(null);
      };
    });
  }
  /** transfrom board */
  transfrom() {
    this.ctx.setTransform(this.t);
    this.regionCtx.setTransform(this.t);
    if (this.img) this.imgTrans();
    this.selectObject?.render();
    this.render();
    this.emit("ontransform", { t: this.t });
  }
  setLayout({ width, height }: { width: number; height: number }) {
    let zoomx = this.viewDomInfo.width / width;
    let zoomy = this.viewDomInfo.height / height;
    let zoom = Math.min(zoomx, zoomy);
    let offsetx = (this.viewDomInfo.width - width * zoom) / 2;
    let offsety = (this.viewDomInfo.height - height * zoom) / 2;
    this.t = {
      a: zoom,
      b: 0,
      c: 0,
      d: zoom,
      e: offsetx,
      f: offsety,
    };
    this.initLayout = {
      zoom,
      offsetx,
      offsety,
      width: width,
      height: height,
    };
    this.transfrom();
  }
  imgTrans() {
    this.img.style.transformOrigin! = `${this.t.e}px ${this.t.f}px`;
    this.img.style.transform! = `scale(${this.t.a}) translate(${this.t.e}px,${this.t.f}px)`;
  }
  /** TODO:优化全部渲染 */
  render() {
    for (var i = 0; i < this.renderGroup.length; i++) {
      this.renderGroup[i] = null;
    }
    this.renderGroup = [];
    this.clearCanvas(this.ctx);
    this.ctx.font = `bold ${~~(16 / this.t.a)}px serif`;
    this.ctx.lineWidth = this.config.lineWidth / this.t.a;
    this.markObjectList.map((item, index) => {
      if (item.status !== "draw" && this.config.showIndex) {
        /**render 序号 */
        this.ctx.fillText(
          index + "",
          item.indexPoint.x,
          item.indexPoint.y - 3 / this.t.a
        );
      }
      this.ctx.strokeStyle = item.color!;
      let path = new Path2D(item.pathData);
      this.renderGroup.push(path);
      this.ctx.stroke(path);
    });
  }

  /** 缩放 */
  appWheel(e: WheelEvent) {
    if (this.config.disableZoom) return;
    if (e.metaKey || e.ctrlKey || e.altKey) {
      e.preventDefault();
      const center = { x: e.offsetX, y: e.offsetY };
      let scale = e.deltaY > 0 ? 0.9 : 1.1;
      scaleOfOuter(this.t, center, scale, scale);
      this.transfrom();
    }
  }
  /** 双击画布 */
  appDblclick() {
    this.t = {
      a: this.initLayout.zoom,
      b: 0,
      c: 0,
      d: this.initLayout.zoom,
      e: this.initLayout.offsetx,
      f: this.initLayout.offsety,
    };
    this.transfrom();
  }
  /** 平移事件 */
  appMoving(point: IPointData) {
    if (this.config.disableMove) return;
    this.view.style.cursor = "grab";
    let moveX = (point.x - this.lastMovePoint.x) * this.t.a;
    let moveY = (point.y - this.lastMovePoint.y) * this.t.a;
    this.t.e += moveX;
    this.t.f += moveY;
    this.transfrom();
    this.emit("onmove", { status: this.moveStatus });
  }
  /** 画布鼠标移动 */
  appMousemove(e: MouseEvent) {
    let point = this.pointMapping(e);
    if (this.mouseDown && this.moveStatus) {
      this.appMoving(point);
      this.lastMovePoint = this.pointMapping(e);
      return;
    }

    this.view.style.cursor = "default";
    // 绘制状态

    let drawStatus = !!this.markObjectList.find(
      (item) => item.status === "draw"
    );
    // 根据状态设置光标
    if (drawStatus) {
      this.view.style.cursor = "crosshair";
    }
    if (this.mouseDown && this.selectObject) {
      this.drag = true;
      this.view.style.cursor = "move";
    }

    e.buttons !== undefined &&
      (this.lastMovePoint = { x: point.x, y: point.y }),
      this.getDrawMark("boxMousemove", point);
  }
  /** 鼠标按下事件 */
  appMousedown(e: MouseEvent): void {
    let point = this.pointMapping(e);
    this.mouseDown = true;
    if (this.moveStatus) return;
    e.buttons === 1 && this.getDrawMark("boxMousedown", point);
  }
  /**绘制的和选中的才触发事件 */
  getDrawMark(
    method: "boxMousedown" | "boxMousemove" | "boxMouseup",
    point: IPointData
  ): void {
    if (this.selectObject) {
      this.selectObject[method](point);
    }
    const drawMark = this.markObjectList[this.markObjectList.length - 1];
    if (drawMark && drawMark.status == "draw") {
      this.markObjectList?.[this.markObjectList.length - 1]?.[method](point);
    }
    return;
  }
  /** 鼠标抬起事件 */
  appMouseup(e: MouseEvent) {
    this.mouseDown = false;
    if (this.moveStatus) return;
    let point = this.pointMapping(e);
    // 如果有选中并且在里面
    // TODO: 优化一下
    if (this.selectObject && this.drag) {
      if (
        !this.selectObject.isPointInside(point) &&
        this.selectObject.acctivePointIndex === -1
      ) {
        this.selectObject = undefined;
      }
      this.drag = false;
      this.getDrawMark("boxMouseup", point);
      this.emit("onchange");
      return;
    }
    let lastMark = this.markObjectList[this.markObjectList.length - 1];
    if (
      lastMark.status === "draw" &&
      lastMark.pointList &&
      this.lastMovePoint?.x !== lastMark?.pointList?.[0]?.x &&
      lastMark.pointList.length > 0 &&
      lastMark?.pointList?.[0]?.x !== lastMark?.pointList?.[1]?.x
    ) {
      this.selectObject = undefined;
    } else {
      let index = this.getSelectedIndex(point);
      if (index !== undefined && this.markObjectList[index]) {
        if (
          this.drag &&
          this.selectObject &&
          this.selectObject.id !== this.markObjectList[index].id
        ) {
        } else {
          this.selectObject = this.markObjectList[index];
        }
        // 如果是正在绘制的
        if (this.markObjectList[index].status === "draw") {
          this.selectObject = undefined;
        }
      } else {
        this.selectObject = undefined;
      }
    }
    this.moveStatus = false;
    this.mouseDown = false;
    this.drag = false;
    this.getDrawMark("boxMouseup", point);
    this.emit("onchange");
  }
  /** 计算相对底图的坐标点位 */
  pointMapping(point: MouseEvent): IPointData {
    let newPoint = { x: 0, y: 0 };
    let pointData = {
      x: point.offsetX || point.x,
      y: point.offsetY || point.y,
    };
    newPoint.x = (pointData.x - this.t.e) / this.t.a;
    newPoint.y = (pointData.y - this.t.f) / this.t.a;
    return newPoint;
  }
  /** 获取选中的图形的index */
  getSelectedIndex(point: IPointData) {
    let indexs: number[] = this.markObjectList.map((_, i) => i).reverse();
    let indexList = indexs.filter((i) => {
      return this.markObjectList[i].isPointInside(point);
    });
    if (indexList.length) {
      // 只有一个 直接返回
      if (indexList.length === 1) {
        return indexList[0];
        // 大于1, 穿透
      } else if (indexList.length > 1) {
        if (this.drag && this.selectObject) {
          return this.selectObject.index - 1;
        }
        if (this.selectObject) {
          const oldIndex = this.selectObject.index - 1;
          if (indexList.indexOf(oldIndex) > -1) {
            return indexList[indexList.indexOf(oldIndex) + 1];
          }
        }
        if (!this.selectObject) {
          return indexList[0];
        }
      }
    }
    return undefined;
  }
  /** 设置绘制模式 */
  async setDrawType(type: IMarkBoardDrawType) {
    if (this.currentDrawingType) {
      let obj = this.markObjectList[this.markObjectList.length - 1];
      if (obj && obj.status === "draw") {
        obj?.destory();
        this.markObjectList.pop();
      }
    }
    this.currentDrawingType = type;
    this.addObjectData();
    this.emit("ondraw", { type });
  }
  /** 获取标注对象 */
  get objects(): IMarkObjectInfo[] {
    return this.markObjectList
      .filter((item) => item.status !== "draw")
      .map((obj) => {
        return {
          id: obj.id,
          label: obj.label,
          type: obj.type,
          color: obj.color,
          select: obj.id === this.selectObject?.id,
          pointList: obj.resultPoints || obj.pointList,
        };
      });
  }
  /** 添加标注对象 */
  public addObjectData() {
    let obj = null;
    if (this.currentDrawingType) {
      try {
        obj = new this.markMap[this.currentDrawingType](this);
      } catch (err) {
        throw new Error(
          `${this.currentDrawingType} mark type is not supported`
        );
      }
    }

    obj && this.markObjectList.push(obj);
    this.emit("onchange");
  }
  /** 设置标注对象 */
  public setObjectData(list: IMarkObjectJSON[]) {
    list.forEach((item) => {
      let obj;
      if (item.type) {
        try {
          obj = this.markMap[item.type].import(this, item);
        } catch (err) {
          throw new Error(`${item.type} mark type is not supported`);
        }
      }
      obj && this.markObjectList.push(obj);
    });
    this.render();
    this.emit("onchange");
  }
  /** 选中对象ID */
  public selectObjectById(id: IMarkObjectId) {
    let obj = this.markObjectList.find((item) => item.id === id);
    if (obj) obj.setSelect(true);
  }
  /** 删除对象 */
  public deleteObject(id: IMarkObjectId) {
    let obj = this.markObjectList.find((item) => item.id === id);
    if (obj) {
      obj.destory();
      this.selectObject?.render();
      this.markObjectList.splice(this.markObjectList.indexOf(obj), 1);
      this.render();
      this.emit("onchange");
    }
  }
  /** 设置移动状态 */
  public setMoveEditStatus(status: boolean) {
    if (this.moveStatus == status) return;
    this.moveStatus = status;
  }
  /** 键盘按下 */
  async windowKeydown(e: KeyboardEvent) {
    if (e.code == "Space") {
      this.setMoveEditStatus(true);
      e.preventDefault();
    }
    if (e.code == "NumpadEnter" || e.code == "Enter") {
      let obj = this.markObjectList[this.markObjectList.length - 1];
      if (obj?.status == "draw") {
        await obj.complete();
      }
    }
    if (e.code == "Delete") {
      // 删除选中的标注对象
      if (this.selectObject) {
        this.deleteObject(this.selectObject.id);
      }
    }
  }
  /** 键盘抬起 */
  windowKeyup(e: KeyboardEvent) {
    if (e.code == "Space") {
      this.setMoveEditStatus(false);
    }
  }
  destroy() {
    window.removeEventListener("keydown", this.windowKeydown);
    window.removeEventListener("keyup", this.windowKeyup);
    this.view.innerHTML = "";
    this.view.replaceWith(this.view.cloneNode(true));
  }

  _events: IObject = Object.create(null);
  on(_type: string, _listener: IEventListener): void {}
  on_(
    _type: string,
    _listener: IEventListener,
    _bind?: IObject
  ): IEventListenerId {
    return {} as IEventListenerId;
  }
  off(_type: string, _listener: IFunction): void {}
  off_(_id: IEventListenerId | IEventListenerId[]): void {}
  emit(_type: string, ..._args: any[]) {}
}
// trick Class Decorator Mutation  https://github.com/Microsoft/TypeScript/issues/4881
