import { MarkObjectType } from ".";
import CanvasMarkBoard from "..";
import { getArrow } from "../utils";
import MarkLineObject from "./line";

/**
 * 标注对象 LINE_ARROW
 * 继承 LINE
 */
export default class MarkLineArrowObject extends MarkLineObject {
  constructor(box: CanvasMarkBoard) {
    super(box);
    this.type = MarkObjectType.LINE_ARROW;
  }

  get pathData() {
    let path = ``;
    if (this.pointList.length) {
      if (
        this.pointList.length === 2 &&
        this.pointList[0].x != this.pointList[1].x &&
        this.pointList[0].y != this.pointList[1].y
      ) {
        path += `M${this.pointList[0].x},${this.pointList[1].y}`;
        path += `L${this.pointList[0].x},${this.pointList[1].y}`;

        const [side2, side1] = this.pointList;
        const [arrow1, arrow2] = getArrow(side2, side1, 20 / this.box.t.a);
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
      }
      path += `Z `;
    }
    return path;
  }
}
