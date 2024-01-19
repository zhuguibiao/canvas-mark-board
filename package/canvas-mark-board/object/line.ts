import { MarkObjectType } from ".";
import CanvasMarkBoard from "..";
import { isPointInPolygon } from "../utils";
import MoveMarkObject from "./moveMark";
import type { IPointData } from "../types";

/**
 * 标注对象 Line (线段)
 */
export default class MarkLineObject extends MoveMarkObject {
  constructor(box: CanvasMarkBoard) {
    super(box);
    this.type = MarkObjectType.LINE;
    this.completeOffset = 2;
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
    let offset = isPointInPolygon(point, this.pointList);
    return offset < expand;
  }
}
