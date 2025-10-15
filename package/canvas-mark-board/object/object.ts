import CanvasMarkBoard from "../index";
import type {
  IPointData,
  IMarkObjectJSON,
  IMarkBoardDrawType,
  IObjectLabelData,
} from "../types";
interface MarkObject {
  /** 销毁 */
  destory(): void;
  /** 完成绘制 */
  complete(): void;
  /** 渲染 */
  render(): void;
  /** 导出函数 */
  export(): IMarkObjectJSON;
  /** 判断点是否在内部 */
  isPointInside(point: IPointData): boolean;
  boxMousedown(point: IPointData): void;
  boxMousemove(point: IPointData): void;
  boxMouseup(point: IPointData): void;
  /** path数据 */
  pathData: string;
  indexPoint: IPointData;
  resultPoints?: IPointData[];
}

/**
 * 标注对象
 */
class MarkObject implements MarkObject {
  /** 标注ID  初始化随机生成 用来比对区分的 */
  id: string = "";
  // 子图形对象数组
  group: any[] = [];
  // 点位列表
  pointList: IPointData[] = [];
  // 上次点位列表
  oldPointList: IPointData[] = [];
  // 最小点位数量
  minPointCount!: number;
  // 对象类型
  type!: IMarkBoardDrawType;
  // 标签
  data: any = {};
  label: string = "";
  color: string = "#ff0000";
  // 序号
  index: number = 1;
  // 父级容器
  box!: CanvasMarkBoard;
  // 容器事件ID
  boxEventIds: any[] = [];
  // 状态 draw=绘制中  edit=编辑中 done=已完成
  status: "draw" | "edit" | "done" = "draw";
  // 完成中
  completeing: boolean = false;
  // 选中偏差
  expent: number = 5;
  // 鼠标按下
  mouseDown: boolean = false;
  // 鼠标最后按下坐标
  lastMousePoint?: IPointData = { x: 0, y: 0 };
  /** 激活点位 */
  acctivePointIndex: number = -1;
  /**旋转信息 */
  rotation?: number = undefined;

  /**
   * 设置选中状态
   * @param select
   */
  setSelect() {
    // 清空已有选中
    if (this.box.selectObject) {
      this.box.selectObject.status = "done";
      this.box.selectObject.render();
      this.box.selectObject = undefined;
    }
        // 选中的最高层
    if (this.status !== 'draw') {
      this.status = 'edit';
    }
    this.box.selectObject = this;
    this.render();
    this.box.emit("onchange");
  }
  
  setData(data: IObjectLabelData) {
    const { label, color } = data;
    if (label) {
      this.label = label;
    }
    if (color) {
      this.color = color;
    }
    this.render();
    this.box.render();
    this.box.emit("onchange");
  }
}

export default MarkObject;
