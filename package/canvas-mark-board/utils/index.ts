import type { IPointData } from "../types";
export { MatrixHelper } from "./MatrixHelper";

/**
 * 获取鼠标距离那个点最近
 * @param oPoint
 * @returns
 */
export function getMinDistance(
  oPoint: IPointData,
  pointList: IPointData[],
  expand: number,
  zoom: number
) {
  let minDistance = Infinity;
  let minDistanceIndex = -1;
  pointList.forEach((point, index) => {
    let distance = Math.sqrt(
      Math.pow(point.x - oPoint.x, 2) + Math.pow(point.y - oPoint.y, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      minDistanceIndex = index;
    }
  });
  if (minDistance < expand / zoom) return minDistanceIndex;
  return -1;
}

/**
 * @param point 点位1
 * @param point2 点位2
 * @param l 箭头长度
 * @param θ 箭头角度
 * @returns
 */
export const getArrow = (
  point: IPointData,
  point2: IPointData,
  l = 50,
  θ = 40
): [IPointData, IPointData] => {
  const { x: x1, y: y1 } = point;
  const { x: x2, y: y2 } = point2;
  let a = Math.atan2(y2 - y1, x2 - x1);
  return [
    {
      x: x2 - l * Math.cos(a + (θ * Math.PI) / 180),
      y: y2 - l * Math.sin(a + (θ * Math.PI) / 180),
    },
    {
      x: x2 - l * Math.cos(a - (θ * Math.PI) / 180),
      y: y2 - l * Math.sin(a - (θ * Math.PI) / 180),
    },
  ];
};

export const getSides = (point: IPointData, point2: IPointData): any => {
  const { x: x1, y: y1 } = point;
  const { x: x2, y: y2 } = point2;
  return [
    {
      x: (x1 + x2) / 2 - (y1 - y2) / 6,
      y: (y1 + y2) / 2 + (x1 - x2) / 6,
    },
    {
      x: (x1 + x2) / 2 + (y1 - y2) / 6,
      y: (y1 + y2) / 2 - (x1 - x2) / 6,
    },
  ];
};
export const getDistance = (point: IPointData, point2: IPointData): number => {
  const s = Math.sqrt(
    Math.pow(point.x - point2.x, 2) + Math.pow(point.y - point2.y, 2)
  );
  return s;
};

export function isSamePoint(point: IPointData, point2: IPointData): boolean {
  return point.x === point2.x && point.y === point2.y;
}
/**
 * 判断点是否在多边形内部
 * @param point 点位
 * @param polygon 多边形点位列表
 * @param expand 向外扩展  点位在多边形外围多少像素内都算在多边形内 默认5
 * @returns boolean
 */
export function isPointInPolygon(
  point: IPointData,
  polygon: IPointData[]
): number {
  let inside = false;
  let minDist = Infinity;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x,
      yi = polygon[i].y;
    const xj = polygon[j].x,
      yj = polygon[j].y;

    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
    const dx = xj - xi,
      dy = yj - yi;
    const t = ((point.x - xi) * dx + (point.y - yi) * dy) / (dx * dx + dy * dy);
    const t_clamped = Math.max(0, Math.min(1, t));
    const nearest_x = xi + t_clamped * dx;
    const nearest_y = yi + t_clamped * dy;
    const dist = Math.sqrt(
      (point.x - nearest_x) ** 2 + (point.y - nearest_y) ** 2
    );
    if (dist < minDist) minDist = dist;
  }

  return inside ? -minDist : minDist;
}

/**
 * 生成随机UUID
 */
export function getUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0;
    var v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}