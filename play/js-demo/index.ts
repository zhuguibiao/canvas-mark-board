import CanvasMarkBoard, {
  ClickMarkObject,
  MarkBoardUtils,
} from "canvas-mark-board";
import Img from "../../assets/image.jpg";
import json from "../../assets/data.json";

class MarkSidesPolygonObject extends ClickMarkObject {
  constructor(box) {
    super(box);
    this.type = "point";
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
      const [side1, side2] = MarkBoardUtils.getSides(
        this.pointList[0],
        this.pointList[1]
      );
      const [arrow1, arrow2] = MarkBoardUtils.getArrow(
        side2,
        side1,
        20 / this.box.t.a
      );
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
class MarkPointObject extends ClickMarkObject {
  constructor(box) {
    super(box);
    this.type = "polyline_arrow" as any;
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
      if (this.pointList.length >= 2) {
        for (let i = 0; i < this.pointList.length - 1; i++) {
          const [arrow1, arrow2] = MarkBoardUtils.getArrow(
            this.pointList[i],
            this.pointList[i + 1],
            20 / this.box.t.a
          );
          path += `M${arrow1.x},${arrow1.y}`;
          path += `L${this.pointList[i + 1].x},${this.pointList[i + 1].y}`;
          path += `M${this.pointList[i + 1].x},${this.pointList[i + 1].y}`;
          path += `L${arrow2.x},${arrow2.y}`;
          path += `M${this.pointList[i + 1].x},${this.pointList[i + 1].y}`;
        }
      }
    }
    return path;
  }
}

window.onload = onload;

function onload() {
  document.getElementById("upload").onclick = upload;
  document.getElementById("clear").onclick = clear;
  document.getElementById("importJson").onclick = importJson;
  document.getElementById("creact").onclick = creact;
  document.getElementById("destroy").onclick = destroy;
  let mark: CanvasMarkBoard;
  let markObjectList: any[] = [];
  let labelInputElm: HTMLInputElement = document.querySelector("#labelInput");
  let colorInputElm: HTMLInputElement = document.querySelector("#colorInput");
  let textareaElm: HTMLTextAreaElement = document.querySelector("#textarea");
  let labelInput = labelInputElm.value;
  let colorInput = colorInputElm.value;

  labelInputElm.onchange = (e: any) => {
    labelInput = e.target.value;
  };
  colorInputElm.onchange = (e: any) => {
    colorInput = e.target.value;
  };
  // 创建
  creact();

  (document.querySelector(".mark-operate") as HTMLElement).onclick =
    setDrawType;

  // 设置画线类型
  function setDrawType(e: any) {
    if (e.target.dataset.type) {
      mark.setDrawType(e.target.dataset.type);
    }
  }
  // 上传图片
  function upload() {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = function (e) {
      let file = (e.target as any).files[0];
      if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
          mark?.setBackground((e.target as any).result).then(() => {
            mark.setDrawType(mark.currentDrawingType || "rect");
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }
  // 清空
  function clear() {
    mark.clearMarkShapes();
  }
  // 创建
  function creact() {
    if (mark) return;
    mark = new CanvasMarkBoard({
      view: "#mark-box", // ID名或者DOM对象
    });
    mark.register("sides_polygon", MarkSidesPolygonObject);
    mark.register("polyline_arrow", MarkPointObject);
    mark?.setBackground(Img).then(() => {
      mark.setDrawType(mark.currentDrawingType || "rect");
    });
    mark.on("ondraw", (e) => {
      mark.currentDrawingType = e.type;
    });
    mark.on("oncomplete", (e) => {
      e.ok({ label: labelInput, color: colorInput });
    });
    mark.on("onchange", () => {
      markObjectList = mark.objects;
      creactList();
      textareaElm.value = JSON.stringify(markObjectList);
    });
  }
  // 销毁
  function destroy() {
    mark.destroy();
    mark = undefined;
  }
  // 导入
  function importJson() {
    mark.setObjectData(json as any);
  }

  // 创建右侧列表
  function creactList() {
    var box = document.getElementById("mark-list");
    var arr = [];
    arr.push("<ul id='mark-list-ul'>");
    for (var i = 0; i < markObjectList.length; i++) {
      var label = markObjectList[i].label;
      arr.push(`<li>
        ${label}
      <button data-type='del' data-id=${markObjectList[i].id}>删除</button>
      </li>`);
    }
    arr.push("</ul>");
    box.innerHTML = arr.join("");

    document.getElementById("mark-list-ul").onclick = (e: any) => {
      if (e.target.dataset.type) {
        switch (e.target.dataset.type) {
          case "del":
            mark.deleteObject(e.target.dataset.id);
            break;
          default:
            break;
        }
      }
    };
  }
}
