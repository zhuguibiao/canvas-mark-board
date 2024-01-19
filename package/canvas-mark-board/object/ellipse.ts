import { MarkObjectType } from ".";
import CanvasMarkBoard from "..";
import { getMinDistance } from "../utils/index";
import type { IPointData } from "../types";
import MoveMarkObject from "./moveMark";
/**
 * 标注对象 Ellipse
 */
export default class MarkEllipseObject extends MoveMarkObject {
  constructor(box: CanvasMarkBoard) {
    super(box);
    this.type = MarkObjectType.ELLIPSE;
  }
  setCursor() {
    if ([0, 2].includes(this.acctivePointIndex)) {
      this.box.view.style.cursor = "col-resize";
    } else if ([1, 3].includes(this.acctivePointIndex)) {
      this.box.view.style.cursor = "row-resize";
    }
  }
  setMoveEdit(offset: any): void {
    /**
     * 4个点位操作
     */
    if (this.acctivePointIndex === 0) {
      this.pointList[1] = {
        x: this.pointList[1].x - offset.x,
        y: this.pointList[1].y,
      };
    } else if (this.acctivePointIndex === 1) {
      this.pointList[1] = {
        x: this.pointList[1].x,
        y: this.pointList[1].y + offset.y,
      };
    } else if (this.acctivePointIndex === 2) {
      this.pointList[1] = {
        x: this.pointList[1].x + offset.x,
        y: this.pointList[1].y,
      };
    } else if (this.acctivePointIndex === 3) {
      this.pointList[1] = {
        x: this.pointList[1].x,
        y: this.pointList[1].y - offset.y,
      };
    }
  }
  /**
   * 获取椭圆顶点
   */
  get vertexList(): IPointData[] {
    if (this.pointList.length === 2) {
      let xr = this.pointList[1].x - this.pointList[0].x;
      let yr = this.pointList[1].y - this.pointList[0].y;
      /**
       * 1: 左，中心点
       * 2: 上，中心点
       * 3: 右，中心点
       * 4: 下，中心点
       */
      return [
        { x: this.pointList[0].x - xr, y: this.pointList[0].y },
        { x: this.pointList[0].x, y: this.pointList[0].y + yr },
        { x: this.pointList[1].x, y: this.pointList[1].y - yr },
        { x: this.pointList[0].x, y: this.pointList[0].y - yr },
      ];
    } else {
      return [];
    }
  }
  /**
   * 获取椭圆顶点
   */
  get ellipseData(): any {
    if (this.pointList.length === 2) {
      let xr = Math.abs(this.pointList[1].x - this.pointList[0].x);
      let yr = Math.abs(this.pointList[1].y - this.pointList[0].y);
      /**
       * 1: 左，中心点
       * 2: 上，中心点
       * 3: 右，中心点
       * 4: 下，中心点
       */
      return {
        pointList: this.pointList[0],
        xr,
        yr,
      };
    } else {
      return null;
    }
  }
  get indexPoint() {
    return this.vertexList[1];
  }
  get pathData() {
    let path = ``;
    if (this.pointList.length) {
      let xr = Math.abs(this.pointList[1].x - this.pointList[0].x);
      let yr = Math.abs(this.pointList[1].y - this.pointList[0].y);
      path += `
        M ${this.vertexList[0].x} ${this.vertexList[0].y} 
        A ${xr} ${yr} 0 0 1 ${this.vertexList[2].x} ${this.vertexList[2].y}
        A ${xr} ${yr} 0 0 1 ${this.vertexList[0].x} ${this.vertexList[0].y}
      `;
      path += `Z `;
    }

    return path;
  }
  isPointInside(point: IPointData): boolean {
    /**
     * (x-h)²/a² + (y-k)²/b² <= 1
     * （h，k）是椭圆的中心,a和b是椭圆的长半轴和短半轴
     */
    if (!this.pointList.length || this.status === "draw") return false;
    const { xr, yr, pointList: center } = this.ellipseData;
    return (
      (point.x - center.x) ** 2 / xr ** 2 +
        (point.y - center.y) ** 2 / yr ** 2 <=
        1 ||
      getMinDistance(point, this.vertexList, this.expent, this.box.t.a) > -1
    );
  }
}
