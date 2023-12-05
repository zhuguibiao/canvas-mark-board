import { MarkObjectType } from ".";
import CanvasMarkBoard from "..";
import { getArrow, getSides } from "../utils";
import MarkPolygonObject from "./polygon";

/**
 * 标注对象 SIDES_POLYGON
 * 继承 POLYGON
 */
export default class MarkSidesPolygonObject extends MarkPolygonObject {
  constructor(box: CanvasMarkBoard) {
    super(box);
    this.type = MarkObjectType.SIDES_POLYGON;
  }
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
      const [side1, side2] = getSides(this.pointList[0], this.pointList[1]);
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
