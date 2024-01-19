import { MarkObjectType } from ".";
import CanvasMarkBoard from "..";
import ClickMarkObject from "./clickMark";
/**
 * 标注对象 POLYGON
 */
export default class MarkPolygonObject extends ClickMarkObject {
  constructor(box: CanvasMarkBoard) {
    super(box);
    this.type = MarkObjectType.POLYGON;
    this.minPointCount = 3;
    this.isClosed = true;
  }
}
