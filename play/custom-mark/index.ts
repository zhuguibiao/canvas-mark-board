import CanvasMarkBoard from "canvas-mark-board";
const { ClickMarkObject, MoveMarkObject, MarkBoardUtils } = CanvasMarkBoard;

interface IPointData {
  x: number;
  y: number;
}

const getDistance = (point: IPointData, point2: IPointData): number => {
  const s = Math.sqrt(
    Math.pow(point.x - point2.x, 2) + Math.pow(point.y - point2.y, 2)
  );
  return s;
};

class Circle {
  config: any;
  constructor(config: any) {
    this.config = config;
  }
  public get __tag() {
    return "Circle";
  }
  public draw() {
    const { center, radius, fillColor = "black", ctx } = this.config;
    const { x, y } = center;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = fillColor;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}
/** 自定义点 */
class MarkDotObject extends ClickMarkObject {
  constructor(box: any) {
    super(box);
    this.type = "dot" as any;
    this.minPointCount = 1;
    this.maxPointCount = 1;
  }
  /** 判断点是否在多边形内部 */
  isPointInside(point: IPointData): boolean {
    let expand = this.expent / this.box.initLayout.zoom;
    // 勾股定理
    if (!this.pointList.length || this.status === "draw") return false;
    let distanceFromCenter = Math.sqrt(
      Math.pow(this.pointList[0].x - point.x, 2) +
        Math.pow(this.pointList[0].y - point.y, 2)
    );
    let distance = 4;
    return distanceFromCenter <= distance + expand && distance !== 0;
  }
  /** 渲染 */
  render() {
    this.removeAll();
    let {
      config,
      regionCtx: ctx,
      t: { a: zoom },
    } = this.box;
    if (!this.box.selectObject) {
      this.box.clearCanvas(ctx);
    }
    if (this.status === "edit") {
      this.box.clearCanvas(ctx);
      ctx.fillStyle =
        this.status === "edit" ? config.fillColor : "rgba(0,0,0,0)";
      ctx.fill(new Path2D(this.pathData));
      this.pointList.map((item, index) => {
        let circle = null;
        if (this.acctivePointIndex === index) {
          circle = new Circle({
            ctx,
            center: item,
            radius: 8 / zoom,
            fillColor: this.color!,
          });
        } else {
          circle = new Circle({
            ctx,
            center: item,
            radius: 6 / zoom,
            fillColor: this.color!,
          });
        }
        circle.draw();
      });
    }
  }
  get pathData(): string {
    let path = ``;
    if (this.pointList.length) {
      let point1 = {
        x: this.pointList[0].x - 4,
        y: this.pointList[0].y,
      };
      let point2 = {
        x: this.pointList[0].x + 4,
        y: this.pointList[0].y,
      };

      let distance = getDistance(this.pointList[0], point1);
      path += `
          M ${point1.x} ${point1.y} 
          A ${distance} ${distance} 0 0 1 ${point2.x} ${point2.y}
          A ${distance} ${distance} 0 0 1 ${point1.x} ${point1.y}
        `;
      path += `Z `;
    }
    return path;
  }
}
/** 自定义带方向的线 */
class MarkSidesArrowObject extends MoveMarkObject {
  constructor(box: any) {
    super(box);
    this.type = "sides_arrow" as any;
  }
  setMoveEdit(): void {
    this.pointList[this.acctivePointIndex] = {
      x: this.lastMousePoint!.x,
      y: this.lastMousePoint!.y,
    };
  }
  isPointInside(point: { x: number; y: number }): boolean {
    let expand = this.expent / this.box.t.a;
    let offset = MarkBoardUtils.isPointInPolygon(point, this.pointList);
    return offset < expand;
  }
  get pathData() {
    let path = ``;
    if (
      this.pointList.length === 2 &&
      this.pointList[0].x != this.pointList[1].x &&
      this.pointList[0].y != this.pointList[1].y
    ) {
      path += `M${this.pointList[0].x},${this.pointList[1].y}`;
      path += `L${this.pointList[0].x},${this.pointList[1].y}`;
      const [side1, side2] = MarkBoardUtils.getSides(
        this.pointList[0],
        this.pointList[1]
      );
      const [arrow1, arrow2] = MarkBoardUtils.getArrow(
        side2,
        side1,
        20 / this.box.t.a
      );
      path += `Z`;
      path += `M${side2.x},${side2.y}`;
      path += `L${side1.x},${side1.y}`;
      // 绘制三角形
      path += `Z`;
      path += `M${arrow1.x},${arrow1.y}`;
      path += `L${side1.x},${side1.y}`;
      path += `M${side1.x},${side1.y}`;
      path += `L${arrow2.x},${arrow2.y}`;
      path += `Z`;
      // 连接到原来位置
      path += `M${this.pointList[0].x},${this.pointList[0].y}`;
      path += `L${this.pointList[1].x},${this.pointList[1].y}`;

      path += `L${this.pointList[0].x},${this.pointList[0].y} `;
      path += `L${this.pointList[this.pointList.length - 1].x},${
        this.pointList[this.pointList.length - 1].y
      } `;
      path += `Z `;
    }

    return path;
  }
}
/** 自定义多线段箭头 */
class MarkPolylineArrowObject extends ClickMarkObject {
  constructor(box: any) {
    super(box);
    this.type = "polyline_arrow" as any;
  }
  /** 获取path  */
  get pathData() {
    let path = ``;
    if (this.pointList.length) {
      this.pointList.forEach((point, index) => {
        if (index === 0) {
          path += `M${point.x},${point.y}`;
        } else {
          path += `L${point.x},${point.y}`;
        }
      });
      if (this.pointList.length >= 2) {
        for (let i = 0; i < this.pointList.length - 1; i++) {
          const [arrow1, arrow2] = MarkBoardUtils.getArrow(
            this.pointList[i],
            this.pointList[i + 1],
            20 / this.box.t.a
          );
          path += `M${arrow1.x},${arrow1.y}`;
          path += `L${this.pointList[i + 1].x},${this.pointList[i + 1].y}`;
          path += `M${this.pointList[i + 1].x},${this.pointList[i + 1].y}`;
          path += `L${arrow2.x},${arrow2.y}`;
          path += `M${this.pointList[i + 1].x},${this.pointList[i + 1].y}`;
        }
      }
    }
    return path;
  }
}
/** 自定义三角形 */
class MarkTriangleObject extends MoveMarkObject {
  constructor(box: any) {
    super(box);
    this.type = "triangle" as any;
  }
  setMoveEdit(offset: any): void {
    if (this.acctivePointIndex == 0) {
      this.pointList[0] = {
        x: this.pointList[0].x + offset.x,
        y: this.pointList[0].y + offset.y,
      };
    } else if (this.acctivePointIndex === 1) {
      this.pointList[1] = {
        x: this.pointList[1].x + offset.x,
        y: this.pointList[1].y + offset.y,
      };
    } else if (this.acctivePointIndex === 2) {
      this.pointList[0] = {
        x: this.pointList[0].x + offset.x,
        y: this.pointList[0].y,
      };
      this.pointList[1] = {
        x: this.pointList[1].x,
        y: this.pointList[1].y + offset.y,
      };
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
  /** 获取三角形顶点 */
  get vertexList() {
    if (this.pointList.length === 2) {
      return [
        {
          x: (this.pointList[0].x + this.pointList[1].x) / 2,
          y: this.pointList[0].y,
        },
        this.pointList[1],
        { x: this.pointList[0].x, y: this.pointList[1].y },
      ];
    } else {
      return [];
    }
  }
  get indexPoint() {
    return this.vertexList[0];
  }
  /** 获取三角形结果点 */
  get resultPoints() {
    return this.vertexList;
  }
}
/** 自定义旋转rect*/
class MarkRotateRectObject extends MoveMarkObject {
  rotation: any;
  constructor(box: CanvasMarkBoard) {
    super(box);
    this.type = "rotateRect" as any;
    this.minPointCount = 2;
    this.rotation = 0;
  }
  setCursor() {}
  setMoveEdit(): void {
    if (this.acctivePointIndex == 4) {
      const dx = this.lastMousePoint.x - this.centerPointer.x;
      const dy = this.lastMousePoint.y - this.centerPointer.y;
      // 计算旋转角度
      this.rotation = ((Math.atan2(dy, dx) * 180) / Math.PI + 90) % 360;
      return;
    } else {
      // 拖动角点
      const rad = (-this.rotation * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const cx = this.centerPointer.x;
      const cy = this.centerPointer.y;

      // 转换为未旋转的坐标系
      const relX = this.lastMousePoint.x - cx;
      const relY = this.lastMousePoint.y - cy;

      // 应用反向旋转
      const newX = cx + (relX * cos - relY * sin);
      const newY = cy + (relX * sin + relY * cos);
      switch (this.acctivePointIndex) {
        case 0: // 左上
          this.pointList[0].x = newX;
          this.pointList[0].y = newY;
          break;
        case 1: // 右上
          this.pointList[0].x = newX;
          this.pointList[1].y = newY;
          break;
        case 2: // 右下
          this.pointList[1].x = newX;
          this.pointList[1].y = newY;
          break;
        case 3: // 左下
          this.pointList[1].x = newX;
          this.pointList[0].y = newY;
          break;
      }
    }
  }
  getTransformedPoints() {
    const rad = (this.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const center = this.centerPointer;
    return [
      { x: this.pointList[0].x, y: this.pointList[0].y }, // 左上
      { x: this.pointList[0].x, y: this.pointList[1].y }, // 左下
      { x: this.pointList[1].x, y: this.pointList[1].y }, // 右下
      { x: this.pointList[1].x, y: this.pointList[0].y }, // 右上
      {
        x: (this.pointList[0].x + this.pointList[1].x) / 2,
        y: this.pointList[0].y,
      }, // 旋转点
    ].map((point) => {
      const relX = point.x - center.x;
      const relY = point.y - center.y;
      return {
        x: center.x + (relX * cos - relY * sin),
        y: center.y + (relX * sin + relY * cos),
      };
    });
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
  /**
   * 获取中心点
   */
  get centerPointer() {
    if (this.pointList.length === 2) {
      return {
        x: (this.pointList[0].x + this.pointList[1].x) / 2,
        y: (this.pointList[0].y + this.pointList[1].y) / 2,
      };
    }
  }
  /**
   * 获取矩形顶点
   */
  get vertexList(): IPointData[] {
    if (this.pointList.length === 2) {
      return this.getTransformedPoints();
    } else {
      return [];
    }
  }
  /**
   * 获取结果点
   */
  get resultPoints() {
    let res = this.getTransformedPoints();
    res.pop();
    return res;
  }
}

export {
  MarkDotObject,
  MarkSidesArrowObject,
  MarkPolylineArrowObject,
  MarkTriangleObject,
  MarkRotateRectObject,
};
