import { MarkObjectType } from ".";
import CanvasMarkBoard from "..";
import { Circle } from "../shapes";
import { getMinDistance, getUUID, isPointInPolygon } from "../utils";
import MarkObject from "./object";
import type {
  IPointData,
  IObjectLabelData,
  IMarkObjectJSON,
} from "../types";
/**
 * 标注对象 Rect
 */
export default class MarkRectObject extends MarkObject {
  constructor(box: CanvasMarkBoard) {
    super();
    // 生成随机ID
    this.id = getUUID();
    // 设置最小点位数量
    this.minPointCount = 2;
    // 标注类型
    this.type = MarkObjectType.RECT;
    // 设置父级容器
    this.box = box;
    this.index = box.markObjectList.length + 1;
    // 盒子事件
    this.boxEventIds = [
      this.box.on_("onmousemove", this.boxMousemove, this),
      this.box.on_("onmousedown", this.boxMousedown, this),
      this.box.on_("onmouseup", this.boxMouseup, this),
    ];
  }

  /** 鼠标按下 */
  boxMousedown(e: IPointData) {
    let point = e;
    if (this.status == "draw") {
      this.pointList = [point, point];
      this.mouseDown = true;
    }
    if (this.box.selectObject) {
      if (this.box.selectObject.id === this.id && this.isPointInside(point)) {
        this.mouseDown = true;
        this.lastMousePoint = this.box.lastPoint!;
      }
    }
  }
  /** 鼠标移动 */
  boxMousemove() {
    if (this.box.selectObject) {
      if (this.box.selectObject.id != this.id) {
        return;
      }
    }
    if (this.completeing == true) return;
    if (this.status == "draw" && this.pointList[0]) {
      this.pointList[1] = this.box.lastPoint!;
      this.render();
    }
    // 更新鼠标样式
    if (this.acctivePointIndex !== -1) {
      this.box.view.style.cursor = [
        "nwse-resize",
        "nesw-resize",
        "nwse-resize",
        "nesw-resize",
      ][this.acctivePointIndex];
    }
    if (
      this.box.selectObject?.id === this.id &&
      this.mouseDown &&
      this.status == "edit"
    ) {
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
        // 矩形点位修改
        let point = { ...this.vertexList[this.acctivePointIndex] };
        let point1; // 对角点
        // 确定对角
        if (this.acctivePointIndex == 0) {
          point1 = { ...this.vertexList[2] };
        } else if (this.acctivePointIndex == 1) {
          point1 = { ...this.vertexList[3] };
        } else if (this.acctivePointIndex == 2) {
          point1 = { ...this.vertexList[0] };
        } else if (this.acctivePointIndex == 3) {
          point1 = { ...this.vertexList[1] };
        }
        point = { ...this.box.lastPoint! };
        let minx = Math.min(point.x, point1!.x);
        let miny = Math.min(point.y, point1!.y);
        let maxx = Math.max(point.x, point1!.x);
        let maxy = Math.max(point.y, point1!.y);
        this.pointList = [
          { x: minx, y: miny },
          { x: maxx, y: maxy },
        ];
        this.acctivePointIndex = this.vertexList.findIndex(
          (item) => item.x == point.x && item.y == point.y
        );
      }
      // 更新最后鼠标位置
      this.lastMousePoint = this.box.lastPoint!;
      this.render();
    } else if (this.status == "edit") {
      this.acctivePointIndex = getMinDistance(
        this.box.lastPoint!,
        this.vertexList,
        this.expent,
        this.box.t.a
      );
      this.render();
    }
  }
  /** 鼠标松开 */
  boxMouseup() {
    if (this.box.selectObject) {
      if (this.box.selectObject.id != this.id) {
        return;
      } else if (this.box.selectObject.id === this.id) {
        this.status = "edit";
        this.lastMousePoint = this.box.lastPoint!;
        this.acctivePointIndex = getMinDistance(
          this.lastMousePoint,
          this.vertexList,
          this.expent,
          this.box.t.a
        );
        this.render();
        this.box.render();
      }
    } else if (this.status !== "draw") {
      this.status = "done";
    }

    this.mouseDown = false;
    if (this.status == "draw" || this.status == "edit") {
      if (this.pointList.length === 2) {
        // 排序小的在前面
        let minx = Math.min(this.pointList[0].x, this.pointList[1].x);
        let miny = Math.min(this.pointList[0].y, this.pointList[1].y);
        let maxx = Math.max(this.pointList[0].x, this.pointList[1].x);
        let maxy = Math.max(this.pointList[0].y, this.pointList[1].y);
        this.pointList = [
          { x: minx, y: miny },
          { x: maxx, y: maxy },
        ];
      }
    }
    if (this.status == "draw") {
      if (this.pointList.length === 2) {
        this.complete();
      }
    }
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
    if (this.pointList.length < this.minPointCount) return;
    let offset = Math.max(
      Math.abs(this.pointList[0].x - this.pointList[1].x),
      Math.abs(this.pointList[0].y - this.pointList[1].y)
    );
    if (offset < 30) {
      this.status = "draw";
      this.pointList = [];
      this.render();
      return;
    }
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
  /**
   * 获取矩形顶点
   */
  get vertexList(): IPointData[] {
    if (this.pointList.length === 2) {
      // 更具矩形两个点  4个顶点
      return [
        this.pointList[0],
        { x: this.pointList[0].x, y: this.pointList[1].y },
        this.pointList[1],
        { x: this.pointList[1].x, y: this.pointList[0].y },
      ];
    } else {
      return [];
    }
  }
  /** 获取path  */
  get pathData() {
    let path = ``;
    if (this.vertexList.length) {
      this.vertexList.forEach((point, index) => {
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
    // 缩放比例
    let zoom = this.box.t.a;
    let ctx = this.box.regionCtx;

    if (!this.box.selectObject) {
      this.box.clearCanvas(ctx);
    }
    // 线宽
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
      ctx.stroke(path);
      ctx.fillStyle =
        this.status === "edit" ? "rgba(255, 255, 255, 0.5)" : "rgba(0,0,0,0)";
      ctx.fill(path);
      this.vertexList.map((item, index) => {
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
    if (!this.pointList.length || this.status === "draw") return false;
    let expand = this.expent / this.box.t.a;
    let offset = isPointInPolygon(point, this.vertexList);
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
  static import(box: CanvasMarkBoard, data: IMarkObjectJSON): MarkRectObject {
    let obj = new this(box);
    obj.label = data.label;
    obj.pointList = data.pointList;
    obj.status = "done";
    obj.render();
    return obj;
  }
}
