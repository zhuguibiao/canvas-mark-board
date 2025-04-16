import CanvasMarkBoard from "canvas-mark-board";
import Img from "../../assets/image.jpg";
import json from "../../assets/data.json";
import shapeMap from "../../assets/shapeMap.json";
import {
  MarkSidesArrowObject,
  MarkPolylineArrowObject,
  MarkTriangleObject,
  MarkDotObject,
  MarkRotateRectObject,
} from "custom-mark";
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

  creactShapeIcon();
  // 创建
  creact();

  (document.querySelector(".mark-operate") as HTMLElement).onclick =
    setDrawType;

  // 创建mark icon
  function creactShapeIcon() {
    const shapeList = document.querySelector(".mark-shape-list");
    let arr = [];
    for (let index = 0; index < shapeMap.length; index++) {
      const item = shapeMap[index];
      arr.push(`
        <button data-type="${item.type}">
          <svg data-type="${item.type}" viewBox="${item.viewBox}" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path data-type="${item.type}"
              d="${item.icon}"
              fill="#333333"></path>
          </svg>
        </button>`);
    }
    shapeList.innerHTML = arr.join("");
  }

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
      showIndex: false,
    });

    mark.register("sides_arrow", MarkSidesArrowObject);
    mark.register("polyline_arrow", MarkPolylineArrowObject);
    mark.register("triangle", MarkTriangleObject);
    mark.register("dot", MarkDotObject);
    mark.register("rotateRect", MarkRotateRectObject);

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
