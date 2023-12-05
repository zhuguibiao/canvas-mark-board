import MarkCircleObject from "./circle";
import MarkEllipseObject from "./ellipse";
import MarkLineObject from "./line";
import MarkLineArrowObject from "./line_arrow";
import MarkObject from "./object";
import MarkPolygonObject from "./polygon";
import MarkPolylineObject from "./polyline";
import MarkRectObject from "./rect";
import MarkSidesPolygonObject from "./sides_polygon";
import type { IObject } from "../types";
enum MarkObjectType {
  NONE = "",
  /** 矩形 */
  RECT = "rect",
  /** 多边形 */
  POLYGON = "polygon",
  /** 圆 */
  CIRCLE = "circle",
  /** 椭圆 */
  ELLIPSE = "ellipse",
  /** 带方向的多边形 */
  SIDES_POLYGON = "sides_polygon",
  /** 点 */
  POINT = "point",
  /** 线段 */
  LINE = "line",
  /** 多线段 */
  POLYLINE = "polyline",
  /** 线段带箭头 */
  LINE_ARROW = "line_arrow",
}
const markMap: IObject = {
  [MarkObjectType.NONE]: "",
  [MarkObjectType.RECT]: MarkRectObject!,
  [MarkObjectType.POLYGON]: MarkPolygonObject!,
  [MarkObjectType.CIRCLE]: MarkCircleObject!,
  [MarkObjectType.ELLIPSE]: MarkEllipseObject!,
  [MarkObjectType.SIDES_POLYGON]: MarkSidesPolygonObject!,
  [MarkObjectType.POLYLINE]: MarkPolylineObject!,
  [MarkObjectType.LINE]: MarkLineObject!,
  [MarkObjectType.LINE_ARROW]: MarkLineArrowObject!,
};

export { MarkObject, MarkObjectType, markMap };
