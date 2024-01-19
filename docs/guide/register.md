# 自定义图形
自定义绘制图形，有2种方式，一种是滑动绘制，一种是点击绘制的


## 点击绘制
``` ts
import CanvasMarkBoard from "canvas-mark-board";
const { ClickMarkObject, MarkBoardUtils ,register } = CanvasMarkBoard;
class MarkSidesPolygonObject extends ClickMarkObject {
  constructor(box) {
    super(box);
    this.type = "sides_polygon" as any;
  }
  /** 绘制的图形path*/
  get pathData() {
    let path = ``;
    this.pointList.forEach((point, index) => {
      if (index === 0) {
        path += `M${point.x},${point.y}`;
      } else {
        path += `L${point.x},${point.y}`;
      }
    });
    if (this.pointList.length >= 2) {
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
    }
    path += `Z `;
    return path;
  }
}
register("sides_polygon", MarkSidesPolygonObject);
```

## 滑动绘制
``` ts
import CanvasMarkBoard from "canvas-mark-board";
const { MoveMarkObject, register, MarkBoardUtils } = CanvasMarkBoard;
class MarkNewLineObject extends ClickMarkObject {
  constructor(box) {
    super(box);
    this.type = "new_rect" as any;
  }
    setMoveEdit(): void {
    this.pointList[this.acctivePointIndex] = {
      x: this.lastMousePoint!.x,
      y: this.lastMousePoint!.y,
    };
  }
  /** 判断点是否在多边形内部 */
  isPointInside(point: IPointData): boolean {
    let expand = this.expent / this.box.t.a;
    let offset = MarkBoardUtils.isPointInPolygon(point, this.pointList);
    return offset < expand;
  }
}
register("new_line", MarkNewLineObject);

```
