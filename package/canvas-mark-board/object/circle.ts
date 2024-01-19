import { MarkObjectType } from ".";
import CanvasMarkBoard from "..";
import { getDistance } from "../utils";
import MoveMarkObject from "./moveMark";
import type { IPointData } from "../types";

/**
 * 标注对象 Circle
 */
export default class MarkCircleObject extends MoveMarkObject {
  constructor(box: CanvasMarkBoard) {
    super(box);
    this.type = MarkObjectType.CIRCLE;
  }
  setCursor() {
    if (this.acctivePointIndex === 1) {
      this.box.view.style.cursor = "col-resize";
    }
  }
  setMoveEdit(offset: any): void {
    this.pointList[1] = {
      x: this.pointList[1].x + offset.x,
      y: this.pointList[1].y + offset.y,
    };
  }

  get vertexList(): IPointData[] {
    if (this.pointList.length === 2) {
      return [this.pointList[1]];
    } else {
      return [];
    }
  }
  get indexPoint() {
    return this.pointList?.[1];
  }
  get pathData() {
    let path = ``;
    if (this.pointList.length) {
      let point = {
        x: 2 * this.pointList[0].x - this.pointList[1].x,
        y: 2 * this.pointList[0].y - this.pointList[1].y,
      };
      let distance = getDistance(this.pointList[0], this.pointList[1]);
      path += `
          M ${point.x} ${point.y} 
          A ${distance} ${distance} 0 0 1 ${this.pointList[1].x} ${this.pointList[1].y}
          A ${distance} ${distance} 0 0 1 ${point.x} ${point.y}
        `;
      path += `Z `;
    }
    return path;
  }
  isPointInside(point: IPointData): boolean {
    let expand = this.expent / this.box.initLayout.zoom;
    // 勾股定理
    if (!this.pointList.length || this.status === "draw") return false;
    let distanceFromCenter = Math.sqrt(
      Math.pow(this.pointList[0].x - point.x, 2) +
        Math.pow(this.pointList[0].y - point.y, 2)
    );
    let distance = getDistance(this.pointList[0], this.pointList[1]);
    return distanceFromCenter <= distance + expand && distance !== 0;
  }
}
