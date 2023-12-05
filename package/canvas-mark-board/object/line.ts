import { MarkObjectType } from ".";
import CanvasMarkBoard from "..";
import { Circle } from "../shapes";
import {
  getMinDistance,
  getUUID,
  isPointInPolygon,
  isSamePoint,
} from "../utils";
import MarkObject from "./object";
import type { IPointData, IObjectLabelData, IMarkObjectJSON } from "../types";

/**
 * 标注对象 Line (线段)
 */
export default class MarkLineObject extends MarkObject {
  lastPointDown?: IPointData;
  constructor(box: CanvasMarkBoard) {
    super();
    this.id = getUUID();
    this.minPointCount = 2;
    this.type = MarkObjectType.LINE;
    this.box = box;
    this.index = box.markObjectList.length + 1;
    this.boxEventIds = [
      this.box.on_("onmousemove", this.boxOnPointMove, this),
      this.box.on_("onmousedown", this.boxOnPointDown, this),
      this.box.on_("onmouseup", this.boxOnPointUp, this),
    ];
  }

  /** 鼠标按下 */
  async boxOnPointDown(e: IPointData) {
    // 相同点去重
    if (this.lastPointDown && isSamePoint(e, this.lastPointDown as IPointData))
      return;
    if (this.box.selectObject) {
      if (this.box.selectObject.id === this.id && this.isPointInside(e)) {
        this.mouseDown = true;
        this.lastMousePoint = this.box.lastPoint!;
      } else {
        return;
      }
    } else {
      if (this.status == "draw") {
        this.mouseDown = true;
        this.lastPointDown = e;
        this.pointList[0] = e;
      }
    }
  }
  /** 鼠标移动 */
  boxOnPointMove(e: IPointData) {
    if (this.box.selectObject) {
      if (this.box.selectObject.id != this.id) {
        return;
      }
    }
    if (this.mouseDown) {
      if (this.status == "draw") {
        this.pointList[1] = e;
        this.render();
      }
      if (this.status == "edit" && this.box.selectObject?.id === this.id) {
        let offset = {
          x: this.box.lastPoint!.x - this.lastMousePoint!.x,
          y: this.box.lastPoint!.y - this.lastMousePoint!.y,
        };
        if (this.acctivePointIndex == -1) {
          this.pointList = this.pointList.map((point) => {
            return {
              x: point.x + offset.x,
              y: point.y + offset.y,
            };
          });
        } else {
          this.pointList[this.acctivePointIndex] = {
            x: this.lastMousePoint!.x,
            y: this.lastMousePoint!.y,
          };
        }
        this.lastMousePoint = this.box.lastPoint!;
        this.render();
      }
    } else if (this.status == "edit") {
      this.acctivePointIndex = getMinDistance(
        this.box.lastPoint!,
        this.pointList,
        this.expent,
        this.box.t.a
      );
      this.render();
    }
  }
  /** 鼠标松开 */
  boxOnPointUp() {
    this.mouseDown = false;
    if (this.box.selectObject) {
      if (this.box.selectObject.id === this.id) {
        this.status = "edit";
        this.lastMousePoint = this.box.lastPoint!;
        this.acctivePointIndex = getMinDistance(
          this.lastMousePoint,
          this.pointList,
          this.expent,
          this.box.t.a
        );
        this.render();
        this.box.render();
      } else if (this.status !== "draw") {
        this.status = "done";
      }

      // 如果松开是选中的图形，那么draw失效
      if (this.status === "draw" && this.box.selectObject.id !== this.id) {
        this.pointList = [];
        this.render();
        return;
      }
    } else if (this.status !== "draw") {
      this.status = "done";
      this.render();
    }
    if (this.status === "draw") {
      if (this.pointList.length === 2) {
        this.complete();
      }
    }
  }

  /** 完成 */
  async complete() {
    // 点位数量不足
    if (this.pointList.length < this.minPointCount) return;
    // 发送通知获取前端进程的标签数据
    this.completeing = true;
    let labelData = (await new Promise((resolve, reject) => {
      this.box.emit("oncomplete", { ok: resolve, err: reject });
    }).catch(() => {
      this.completeing = false;
      this.pointList = [];
      this.render();
    })) as IObjectLabelData;

    if (!labelData) {
      return;
    }
    // 设置标签
    this.completeing = false;
    this.label = labelData?.label;
    this.status = "done";
    this.render();
    this.box.render();
    this.box.addObjectData();
  }

  /** 销毁 */
  destory() {
    this.box.off_(this.boxEventIds);
    this.pointList = [];
    this.removeAll();
  }
  /** 清空子图形 */
  removeAll() {
    for (var i = 0; i < this.group.length; i++) {
      this.group[i] = null;
    }
    this.group = [];
  }
  /** 获取path  */
  get pathData() {
    let path = ``;
    if (this.pointList.length) {
      this.pointList.forEach((point, index) => {
        // 绘制线段
        if (index === 0) {
          path += `M${point.x},${point.y}`;
        } else {
          path += `L${point.x},${point.y}`;
        }
      });
      path += "Z ";
    }
    return path;
  }
  /** 获取pathIndexPoint */
  get indexPoint() {
    return this.pointList[0];
  }
  /** 渲染 */
  render() {
    this.removeAll();
    let ctx = this.box.regionCtx;
    if (!this.box.selectObject) {
      this.box.clearCanvas(ctx);
    }
    let zoom = this.box.t.a;
    ctx.lineWidth = this.box.config.lineWidth! / zoom;
    ctx.strokeStyle =
      this.status === "draw"
        ? this.box.config.drawColor!
        : this.box.config.color!;
    let path = new Path2D(this.pathData);
    this.group.push(path);
    if (this.status === "draw") {
      ctx.stroke(path);
    }
    if (this.status === "edit") {
      this.box.clearCanvas(ctx);
      ctx.lineWidth = (this.box.config.lineWidth! / zoom) * 2;
      ctx.stroke(path);
      this.pointList.map((item, index) => {
        let circle = null;
        if (this.acctivePointIndex === index) {
          circle = new Circle({
            ctx,
            center: item,
            radius: 8 / zoom,
            fillColor: this.box.config.color!,
          });
        } else {
          circle = new Circle({
            ctx,
            center: item,
            radius: 4 / zoom,
            fillColor: this.box.config.color!,
          });
        }
        circle.draw();
        this.group.push(circle);
      });
    }
  }
  /** 判断点是否在多边形内部 */
  isPointInside(point: IPointData): boolean {
    let expand = this.expent / this.box.t.a;
    let offset = isPointInPolygon(point, this.pointList);
    return offset < expand;
  }
  /** 导出数据 */
  export(): IMarkObjectJSON {
    return {
      index: this.index,
      type: this.type,
      label: this.label,
      pointList: this.pointList,
    };
  }
  /** 导入 */
  static import(box: CanvasMarkBoard, data: IMarkObjectJSON): MarkLineObject {
    let obj = new this(box);
    obj.label = data.label;
    obj.pointList = data.pointList;
    obj.status = "done";
    obj.render();

    return obj;
  }
}
