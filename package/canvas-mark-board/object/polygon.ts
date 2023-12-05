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
import type {
  IPointData,
  IObjectLabelData,
  IMarkObjectJSON,
} from "../types";
/**
 * 标注对象 POLYGON
 */
export default class MarkPolygonObject extends MarkObject {
  // 最后按下
  lastPointDown?: IPointData;
  drag = false;
  constructor(box: CanvasMarkBoard) {
    super();
    this.id = getUUID();
    this.minPointCount = 3;
    this.type = MarkObjectType.POLYGON;
    this.box = box;
    this.index = box.markObjectList.length + 1;
    this.boxEventIds = [
      this.box.on_("onmousemove", this.boxMousemove, this),
      this.box.on_("onmousedown", this.boxMousedown, this),
      this.box.on_("onmouseup", this.boxMouseup, this),
      this.box.on_("oncontextmenu", this.boxContextmenu, this),
    ];
  }
  /** 右键 */
  boxContextmenu() {
    if (this.status === "draw") {
      this.pointList.pop();
      this.render();
    }
  }
  /** 鼠标按下 */
  async boxMousedown(e: IPointData) {
    // 相同点去重
    if (this.lastPointDown && isSamePoint(e, this.lastPointDown as IPointData))
      return;
    if (this.box.selectObject) {
      if (this.box.selectObject.id === this.id) {
        if (this.isPointInside(e)) {
          this.mouseDown = true;
        }
        this.lastMousePoint = this.box.lastPoint!;
      } else {
        return;
      }
    }
    if (this.status == "draw") {
      // 绘制中
      this.lastPointDown = e;
      if (this.pointList.length >= 3) {
        let lineW = 2;
        let offset = {
          x: e.x - this.pointList[0].x,
          y: e.y - this.pointList[0].y,
        };
        if (Math.abs(offset.x) < lineW * 4 && Math.abs(offset.y) < lineW * 4) {
          await this.complete();
          return;
        }
      }
      this.pointList.push(e);
    }
  }
  /** 鼠标移动 */
  boxMousemove() {
    if (this.box.selectObject) {
      if (this.box.selectObject.id != this.id) {
        return;
      }
    }
    if (this.mouseDown && this.status == "edit") {
      this.drag = true;
      // 偏移量
      let offset = {
        x: this.box.lastPoint!.x - this.lastMousePoint!.x,
        y: this.box.lastPoint!.y - this.lastMousePoint!.y,
      };

      if (this.acctivePointIndex == -1) {
        // 更新点位
        this.pointList = this.pointList.map((point) => {
          return {
            x: point.x + offset.x,
            y: point.y + offset.y,
          };
        });
      } else {
        // 更新点位
        this.pointList[this.acctivePointIndex] = {
          x: this.lastMousePoint!.x,
          y: this.lastMousePoint!.y,
        };
      }

      // 更新最后鼠标位置
      this.lastMousePoint = this.box.lastPoint!;
    } else if (this.status == "edit") {
      this.acctivePointIndex = getMinDistance(
        this.box.lastPoint!,
        this.pointList,
        this.expent,
        this.box.t.a
      );
    }
    if (this.status !== "done") {
      this.render();
    }
  }
  /** 鼠标松开 */
  boxMouseup() {
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
      } else if (this.status != "draw") {
        this.status = "done";
      }
      // 如果松开是选中的图形，那么draw失效
      if (this.status === "draw" && this.box.selectObject.id !== this.id) {
        this.pointList = [];
        this.mouseDown = false;
        return;
      }
      this.render();
    } else if (this.status === "edit") {
      this.status = "done";
      this.box.render();
    } else if (this.status === "draw") {
      this.render();
    }

    // 拖拽结束
    if (this.drag && this.status == "edit") {
      this.box.render();
    }
    this.drag = false;
    this.mouseDown = false;
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
      path += `Z `;
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
    if (this.status === "draw") {
      let path = this.pathData;
      if (this.pointList.length >= 2) {
        path += `
        M${this.pointList[this.pointList.length - 1].x},
        ${this.pointList[this.pointList.length - 1].y}
        L${this.pointList[this.pointList.length - 1].x},
        ${this.pointList[this.pointList.length - 1].y} Z`;
      }
      path += `L${this.box.lastPoint!.x},${this.box.lastPoint!.y} Z`;
      let drawPath = new Path2D(path);
      this.group.push(drawPath);
      ctx.stroke(drawPath);
      this.pointList.map((item) => {
        let circle = null;
        circle = new Circle({
          ctx,
          center: item,
          radius: 4 / zoom,
          fillColor: this.box.config.color!,
        });
        this.group.push(circle);
        circle.draw();
      });
    }

    if (this.status === "edit") {
      this.box.clearCanvas(ctx);
      let drawPath = new Path2D(this.pathData);
      this.group.push(drawPath);
      ctx.stroke(drawPath);
      ctx.fillStyle =
        this.status === "edit" ? "rgba(255, 255, 255, 0.5)" : "rgba(0,0,0,0)";
      ctx.fill(new Path2D(this.pathData));
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
        this.group.push(circle);
        circle.draw();
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
  static import(box: CanvasMarkBoard, data: IMarkObjectJSON): MarkPolygonObject {
    let obj = new this(box);
    obj.label = data.label;
    obj.pointList = data.pointList;
    obj.status = "done";
    obj.render();

    return obj;
  }
}
