import Shape, { ShapeConfig } from './Shape';
interface CircleConfig extends ShapeConfig {
  radius: number;
}
export default class Circle extends Shape<CircleConfig> {
  constructor(config: CircleConfig) {
    super();
    this.config = config;
  }
  public get __tag() {
    return 'Circle';
  }
  public draw() {
    const { center, radius, fillColor = 'black', ctx } = this.config;
    const { x, y } = center;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = fillColor;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}
