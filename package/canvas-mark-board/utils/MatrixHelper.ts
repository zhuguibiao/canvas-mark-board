import type { IPointData, IMatrixData } from "../types";
const tempPoint = {} as IPointData;
function get(): IMatrixData {
  return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
}
export const MatrixHelper = {
  set(t: IMatrixData, a = 1, b = 0, c = 0, d = 1, e = 0, f = 0): void {
    t.a = a;
    t.b = b;
    t.c = c;
    t.d = d;
    t.e = e;
    t.f = f;
  },
  get,
  translateInner(t: IMatrixData, x: number, y: number): void {
    t.e += t.a * x + t.c * y;
    t.f += t.b * x + t.d * y;
  },
  scale(t: IMatrixData, x: number, y: number = x): void {
    t.a *= x;
    t.b *= x;
    t.c *= y;
    t.d *= y;
  },
  scaleOfInner(
    t: IMatrixData,
    origin: IPointData,
    x: number,
    y: number = x
  ): void {
    M.translateInner(t, origin.x, origin.y);
    M.scale(t, x, y);
    M.translateInner(t, -origin.x, -origin.y);
  },
  scaleOfOuter(
    t: IMatrixData,
    origin: IPointData,
    x: number,
    y: number = x
  ): void {
    M.toInnerPoint(t, origin, tempPoint);
    M.scaleOfInner(t, tempPoint, x, y);
  },
  toInnerPoint(
    t: IMatrixData,
    outer: IPointData,
    to?: IPointData,
    distance?: boolean
  ): void {
    const { x, y } = outer;
    const { a, b, c, d } = t;
    const s = 1 / (a * d - b * c);

    // inner
    to || (to = outer);
    to.x = (x * d - y * c) * s;
    to.y = (y * a - x * b) * s;

    if (!distance) {
      const { e, f } = t;
      to.x -= (e * d - f * c) * s;
      to.y -= (f * a - e * b) * s;
    }
  },
};

const M = MatrixHelper;
