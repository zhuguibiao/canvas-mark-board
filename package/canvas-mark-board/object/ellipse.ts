import { MarkObjectType } from ".";
import CanvasMarkBoard from "..";
import { Circle } from "../shapes";
import { getMinDistance, getUUID } from "../utils/index";
import MarkObject from "./object";
import type { IPointData, IObjectLabelData, IMarkObjectJSON } from "../types";
/**
 * 标注对象 Ellipse
 */
export default class MarkEllipseObject extends MarkObject {
  // 最后按下
  lastPointDown?: IPointData;
  constructor(box: CanvasMarkBoard) {
    super();
    // 生成随机ID
    this.id = getUUID();
    // 设置最小点位数量
    this.minPointCount = 2;
    // 标注类型
    this.type = MarkObjectType.ELLIPSE;
    // 设置父级容器
    this.box = box;
    this.index = box.markObjectList.length + 1;
    // 盒子事件
    this.boxEventIds = [
      this.box.on_("onmousemove", this.boxOnPointMove, this),
      this.box.on_("onmousedown", this.boxOnPointDown, this),
      this.box.on_("onmouseup", this.boxOnPointUp, this),
    ];
  }
  /** 鼠标按下 */
  async boxOnPointDown(e: IPointData) {
    if (this.status == "draw") {
      this.lastPointDown = e;
      this.pointList = [e, e];
      this.mouseDown = true;
    }
    // 如果选中
    if (this.box.selectObject) {
      if (this.box.selectObject.id === this.id && this.isPointInside(e)) {
        this.mouseDown = true;
        this.lastMousePoint = this.box.lastPoint!;
      }
    }
  }

  /** 鼠标移动 */
  boxOnPointMove() {
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
    // 更新鼠标
    if ([0, 2].includes(this.acctivePointIndex)) {
      this.box.view.style.cursor = "col-resize";
    } else if ([1, 3].includes(this.acctivePointIndex)) {
      this.box.view.style.cursor = "row-resize";
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
        /**
         * 4个点位操作
         */
        if (this.acctivePointIndex === 0) {
          this.pointList[1] = {
            x: this.pointList[1].x - offset.x,
            y: this.pointList[1].y,
          };
        } else if (this.acctivePointIndex === 1) {
          this.pointList[1] = {
            x: this.pointList[1].x,
            y: this.pointList[1].y + offset.y,
          };
        } else if (this.acctivePointIndex === 2) {
          this.pointList[1] = {
            x: this.pointList[1].x + offset.x,
            y: this.pointList[1].y,
          };
        } else if (this.acctivePointIndex === 3) {
          this.pointList[1] = {
            x: this.pointList[1].x,
            y: this.pointList[1].y - offset.y,
          };
        }
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
  boxOnPointUp() {
    if (
      this.mouseDown &&
      this.status == "edit" &&
      this.acctivePointIndex > -1
    ) {
      this.box.selectObject = this;
    }
    // 鼠标在标注内部松开
    if (this.box.selectObject) {
      if (this.box.selectObject.id != this.id) {
        return;
      } else if (this.box.selectObject.id === this.id) {
        this.status = "edit";
        this.lastMousePoint = this.box.lastPoint!;
        this.acctivePointIndex = this.acctivePointIndex = getMinDistance(
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
    if (this.status == "draw") {
      if (this.pointList.length === 2) {
        this.complete();
      }
    }
  }
  /** 清空子图形 */
  removeAll() {
    for (var i = 0; i < this.group.length; i++) {
      this.group[i] = null;
    }
    this.group = [];
  }
  /** 销毁 */
  destory() {
    this.pointList = [];
    // 取消事件监听
    this.removeAll();
    // 删除画布元素
    this.box.off_(this.boxEventIds);
  }
  /** 完成 */
  async complete() {
    // 点位数量不足
    if (this.pointList.length < this.minPointCount) return;

    // 判断两个点位相差超过100
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
   * 获取椭圆顶点
   */
  get vertexList(): IPointData[] {
    if (this.pointList.length === 2) {
      let xr = this.pointList[1].x - this.pointList[0].x;
      let yr = this.pointList[1].y - this.pointList[0].y;
      /**
       * 1: 左，中心点
       * 2: 上，中心点
       * 3: 右，中心点
       * 4: 下，中心点
       */
      return [
        { x: this.pointList[0].x - xr, y: this.pointList[0].y },
        { x: this.pointList[0].x, y: this.pointList[0].y + yr },
        { x: this.pointList[1].x, y: this.pointList[1].y - yr },
        { x: this.pointList[0].x, y: this.pointList[0].y - yr },
      ];
    } else {
      return [];
    }
  }
  /**
   * 获取椭圆顶点
   */
  get ellipseData(): any {
    if (this.pointList.length === 2) {
      let xr = Math.abs(this.pointList[1].x - this.pointList[0].x);
      let yr = Math.abs(this.pointList[1].y - this.pointList[0].y);
      /**
       * 1: 左，中心点
       * 2: 上，中心点
       * 3: 右，中心点
       * 4: 下，中心点
       */
      return {
        pointList: this.pointList[0],
        xr,
        yr,
      };
    } else {
      return null;
    }
  }
  get indexPoint() {
    return this.vertexList[1];
  }
  /** 获取path  */
  get pathData() {
    let path = ``;
    if (this.pointList.length) {
      let xr = Math.abs(this.pointList[1].x - this.pointList[0].x);
      let yr = Math.abs(this.pointList[1].y - this.pointList[0].y);
      path += `
        M ${this.vertexList[0].x} ${this.vertexList[0].y} 
        A ${xr} ${yr} 0 0 1 ${this.vertexList[2].x} ${this.vertexList[2].y}
        A ${xr} ${yr} 0 0 1 ${this.vertexList[0].x} ${this.vertexList[0].y}
      `;
      path += `Z `;
    }

    return path;
  }
  /** 渲染 */
  render() {
    this.removeAll();
    let zoom = this.box.t.a;
    let ctx = this.box.regionCtx;

    if (!this.box.selectObject) {
      this.box.clearCanvas(ctx);
    }
    ctx.lineWidth = 2 / zoom;
    ctx.strokeStyle =
      this.status === "draw"
        ? this.box.config.drawColor!
        : this.box.config.color!;
    let path = new Path2D(this.pathData);
    this.group.push(path);
    if (this.status === "draw") {
      ctx.stroke(path);
    }
    if (this.status == "edit") {
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
    /**
     * (x-h)²/a² + (y-k)²/b² <= 1
     * （h，k）是椭圆的中心,a和b是椭圆的长半轴和短半轴
     */
    if (!this.pointList.length || this.status === "draw") return false;
    const { xr, yr, pointList: center } = this.ellipseData;
    return (
      (point.x - center.x) ** 2 / xr ** 2 +
        (point.y - center.y) ** 2 / yr ** 2 <=
        1 ||
      getMinDistance(point, this.vertexList, this.expent, this.box.t.a) > -1
    );
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
  static import(
    box: CanvasMarkBoard,
    data: IMarkObjectJSON
  ): MarkEllipseObject {
    let obj = new this(box);
    obj.label = data.label;
    obj.pointList = data.pointList;
    obj.status = "done";
    obj.render();
    // 取消事件监听
    return obj;
  }
}
