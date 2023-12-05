import { MarkObjectType } from ".";
import CanvasMarkBoard from "..";
import { Circle } from "../shapes";
import MarkPolygonObject from "./polygon";

/**
 * 标注对象 SIDES_POLYGON
 * 继承 POLYGON
 */
export default class MarkPolylineObject extends MarkPolygonObject {
  constructor(box: CanvasMarkBoard) {
    super(box);
    this.type = MarkObjectType.POLYLINE;
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
  /** 渲染 */
  render() {
    this.removeAll();
    let ctx = this.box.regionCtx;
    if (!this.box.selectObject) {
      this.box.clearCanvas(ctx);
    }
    let zoom = this.box.t.a;
    ctx.lineWidth = this.box.config.lineWidth! / zoom;

    ctx.strokeStyle =
      this.status === "draw"
        ? this.box.config.drawColor!
        : this.box.config.color!;
    if (this.status === "draw") {
      let path = this.pathData;
      path += `L${this.box.lastPoint!.x},${this.box.lastPoint!.y}`;
      let drawPath = new Path2D(path);
      this.group.push(drawPath);
      ctx.stroke(drawPath);
      this.pointList.map((item) => {
        let circle = null;
        circle = new Circle({
          ctx,
          center: item,
          radius: 4 / zoom,
          fillColor: this.box.config.color!,
        });
        this.group.push(circle);
        circle.draw();
      });
    }

    if (this.status === "edit") {
      this.box.clearCanvas(ctx);
      let drawPath = new Path2D(this.pathData);
      this.group.push(drawPath);
      ctx.stroke(drawPath);
      ctx.fillStyle =
        this.status === "edit" ? "rgba(255, 255, 255, 0.5)" : "rgba(0,0,0,0)";
      ctx.fill(drawPath);
      this.pointList.map((item, index) => {
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
        this.group.push(circle);
        circle.draw();
      });
    }
  }
}
