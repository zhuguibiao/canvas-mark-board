import { MarkObjectType } from ".";
import CanvasMarkBoard from "..";
import ClickMarkObject from "./clickMark";

/**
 * 标注对象 SIDES_POLYGON
 * 继承 POLYGON
 */
export default class MarkPolylineObject extends ClickMarkObject {
  constructor(box: CanvasMarkBoard) {
    super(box);
    this.type = MarkObjectType.POLYLINE;
    this.minPointCount = 3;
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
    }
    return path;
  }
}
