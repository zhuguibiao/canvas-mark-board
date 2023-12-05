import type { IPointData } from "../types";
export interface ShapeConfig {
  center: IPointData;
  ctx: CanvasRenderingContext2D;
  fillColor: string;
}
class Shape<ShapeConfig> {
  public config!: ShapeConfig;
}

export default Shape;
