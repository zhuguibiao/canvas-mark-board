import { MarkObjectType } from ".";
import CanvasMarkBoard from "..";
import MoveMarkObject from "./moveMark";
import type { IPointData } from "../types";
/**
 * 标注对象 RECT
 */
export default class MarkPolygonObject extends MoveMarkObject {
  constructor(box: CanvasMarkBoard) {
    super(box);
    this.type = MarkObjectType.RECT;
    this.minPointCount = 2;
  }
  setCursor() {
    if (this.acctivePointIndex !== -1) {
      this.box.view.style.cursor = [
        "nwse-resize",
        "nesw-resize",
        "nwse-resize",
        "nesw-resize",
      ][this.acctivePointIndex];
    }
  }
  setMoveEdit(): void {
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
}
