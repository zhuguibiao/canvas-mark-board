# js-demo源码
[原生js在线演示](https://zhuguibiao.github.io/canvas-mark-board/js-demo/)

::: code-group

```html [html]
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>mark-board</title>
  <script src="https://www.unpkg.com/canvas-mark-board@0.0.1-beta.8/dist/index.umd.js"></script>
</head>
<style>
  * { 
    box-sizing: border-box;
  }
  .remark {
    position: relative;
  }
  .remark:hover div {
    display: block;
  }
  .remark div {
    background: #fff;
    position: absolute;
    display: none;
    z-index: 999;
  }
  #mark-list {
    height: 100%;
    width: 200px;
    overflow: auto;
  }

  .mark-board-box {
    display: flex;
    height: calc(100vh - 200px);
  }

  .mark-operate svg {
    width: 24px;
    height: 24px
  }
</style>

<body style="width:80%;margin: 0 auto;max-width: 1440px;">
  <h3 style="margin: 0;">JS canvas-mark-board Demo:</h3>
  <div>
    <div class="mark-operate">
      <span class="mark-shape-list"></span>
      <button id="upload">上传图片</button>
      <button id="clear">清空画布</button>
      <button id="importJson">导入JSON</button>
      <button id="creact">创建</button>
      <button id="destroy"> 销毁</button>
      标签名：<input id="labelInput" type="text" value="person" />
      颜色：<input id="colorInput" type="color" value="#ff0000" />
      <a class="remark">
        操作说明?
        <div>
          <b>画布操作</b>：1.双击鼠标恢复大小; 2.ctrl或cmd或alt+滚轮缩放;
          3.按住空格拖动画布
          <br />
          <b>多边形绘制</b>：1.右键删除最后一个点;
          2.点击第一个点或者按回车完成绘制
          <br />
          <b>其他操作</b>：1.可以点击图形然后拖动，调整点拖动改变大小;
          2.按Devare键删除对象
          <br />
        </div>
      </a>
    </div>
  </div>
  <div class="mark-board-main">
    <div class="mark-board-box">
      <div style="flex:1">
        <div id="mark-box" style="width:100%;height:100%;border: 1px solid black;"></div>
      </div>
      <div id="mark-list">
      </div>
    </div>
  </div>
  <textarea style="width:100%;height:100%;" id="textarea" cols="30" rows="10"></textarea>
  <!-- 链接自己的js（也就是右边标签的js） -->
  <script src="./test.js"></script>
</body>
</html>
```
```js [js]
var json = [
  {
    id: "f9e1cf23-8903-4f40-8ff9-724363190272",
    label: "person",
    type: "polygon",
    pointList: [
      {
        x: 257.7016248153619,
        y: 189.06942392909895,
      },
      {
        x: 633.0044313146234,
        y: 225.93796159527326,
      },
      {
        x: 257.7016248153619,
        y: 260.9158050221566,
      },
    ],
  },
];
var shapeMap = [
  {
    viewBox: "0 0 1024 1024",
    type: "rect",
    icon: "M904.50393 795.651268V225.084385c32.463366-10.869558 55.862285-41.503253 55.862286-77.623915 0-45.212738-36.647665-81.863473-81.864496-81.863473-35.721573 0-66.084091 22.890336-77.262688 54.798047H226.150158c-11.177574-31.907711-41.538045-54.79907-77.262688-54.79907-45.213761 0-81.864496 36.651758-81.864496 81.864496 0 35.530215 22.63758 65.76175 54.271045 77.086679v571.642379c-31.633465 11.32493-54.271044 41.555441-54.271045 77.084632 0 45.212738 36.652781 81.864496 81.864496 81.864496 34.495652 0 63.98222-21.342074 76.036767-51.532677h577.543786c12.05557 30.190603 41.546232 51.532677 76.035743 51.532677 45.217854 0 81.864496-36.651758 81.864496-81.864496-0.002047-36.120662-23.400966-66.753333-55.864332-77.622892z m-105.182574 56.789401H228.067834c-7.227612-27.548426-28.447912-49.415456-55.609529-57.570183V225.865167c26.077935-7.829316 46.683229-28.300556 54.682414-54.305836H800.249495c7.835456 25.473161 27.768437 45.63434 53.090149 53.80851V795.367813c-26.39516 8.519024-46.930869 30.065759-54.018288 57.072856z",
  },
  {
    viewBox: "0 0 1024 1024",
    type: "polygon",
    icon: "M680.71 915.22H343.29c-39.53 0-76.37-21.27-96.12-55.52L78.46 567.49c-19.75-34.22-19.75-76.77 0-110.99l168.71-292.2c19.75-34.24 56.6-55.52 96.12-55.52h337.42c39.53 0 76.37 21.27 96.12 55.52l168.71 292.2c19.75 34.22 19.75 76.77 0 110.99L776.83 859.7c-19.75 34.24-56.59 55.52-96.12 55.52zM343.29 175.69c-15.7 0-30.35 8.43-38.21 22.04l-168.71 292.2c-7.84 13.61-7.84 30.52 0 44.13l168.71 292.2c7.86 13.61 22.51 22.04 38.21 22.04h337.42c15.7 0 30.35-8.43 38.21-22.04l168.71-292.2c7.84-13.61 7.84-30.52 0-44.13l-168.71-292.2c-7.86-13.61-22.51-22.04-38.21-22.04H343.29z",
  },
  {
    viewBox: "0 0 1024 1024",
    type: "circle",
    icon: "M512 928C282.624 928 96 741.376 96 512S282.624 96 512 96s416 186.624 416 416-186.624 416-416 416z m0-768C317.92 160 160 317.92 160 512s157.92 352 352 352 352-157.92 352-352S706.08 160 512 160z",
  },
  {
    viewBox: "0 0 1024 1024",
    type: "ellipse",
    icon: "M512 838.656c-228.864 0-415.232-146.432-415.232-326.656 0-180.224 186.368-326.656 415.232-326.656 228.864 0 415.232 146.432 415.232 326.656 0 180.224-186.368 326.656-415.232 326.656z m0-589.312c-194.048 0-351.232 117.76-351.232 262.656 0 144.896 157.696 262.656 351.232 262.656s351.232-117.76 351.232-262.656c0-144.896-157.184-262.656-351.232-262.656z",
  },
  {
    viewBox: "0 0 1024 1024",
    type: "line",
    icon: "M960 470.857143H64c-5.028571 0-9.142857 4.114286-9.142857 9.142857v64c0 5.028571 4.114286 9.142857 9.142857 9.142857h896c5.028571 0 9.142857-4.114286 9.142857-9.142857v-64c0-5.028571-4.114286-9.142857-9.142857-9.142857z",
  },
  {
    viewBox: "0 0 1024 1024",
    type: "polyline",
    icon: "M221.342 686.08l-48.837-33.083 215.04-317.44 184.32 239.065L764.849 335.95l45.686 37.021-239.458 296.96-180.382-233.55L221.342 686.08z",
  },
  {
    viewBox: "0 0 1024 1024",
    type: "line_arrow",
    icon: "M593.066667 793.642667a32.170667 32.170667 0 0 1 0-45.226667l236.373333-236.373333L593.066667 275.626667a32 32 0 0 1 45.226666-45.184l258.986667 258.986666a32.170667 32.170667 0 0 1 0 45.226667l-258.986667 258.986667a31.914667 31.914667 0 0 1-45.226666 0z M149.333333 544a32.213333 32.213333 0 0 1-32-32 32.213333 32.213333 0 0 1 32-32h718.08a32.213333 32.213333 0 0 1 32 32 32.213333 32.213333 0 0 1-32 32z",
  },
  {
    viewBox: "0 0 480 480",
    type: "sides_arrow",
    icon: " M20 260 H460 V230 H20Z M225 85 V400 H255 V115Z M170 170 L240 100 L220 80 L150 150Z M310 170 L220 80 L240 60 L330 150Z",
  },
  {
    viewBox: "0 0 1024 1024",
    type: "polyline_arrow",
    icon: "M593.066667 793.642667a32.170667 32.170667 0 0 1 0-45.226667l236.373333-236.373333L593.066667 275.626667a32 32 0 0 1 45.226666-45.184l258.986667 258.986666a32.170667 32.170667 0 0 1 0 45.226667l-258.986667 258.986667a31.914667 31.914667 0 0 1-45.226666 0z M149.333333 544a32.213333 32.213333 0 0 1-32-32 32.213333 32.213333 0 0 1 32-32h718.08a32.213333 32.213333 0 0 1 32 32 32.213333 32.213333 0 0 1-32 32z",
  },
  {
    viewBox: "0 0 24 24",
    type: "triangle",
    icon: "M12 7.77L18.39 18H5.61L12 7.77M12 4L2 20h20L12 4z",
  },
];

const { ClickMarkObject, MoveMarkObject, MarkBoardUtils } = CanvasMarkBoard;

/** 自定义带方向的线 */
class MarkSidesArrowObject extends MoveMarkObject {
  constructor(box) {
    super(box);
    this.type = "sides_arrow";
  }
  setMoveEdit() {
    this.pointList[this.acctivePointIndex] = {
      x: this.lastMousePoint.x,
      y: this.lastMousePoint.y,
    };
  }
  isPointInside(point) {
    let expand = this.expent / this.box.t.a;
    let offset = MarkBoardUtils.isPointInPolygon(point, this.pointList);
    return offset < expand;
  }
  get pathData() {
    let path = ``;
    if (
      this.pointList.length === 2 &&
      this.pointList[0].x != this.pointList[1].x &&
      this.pointList[0].y != this.pointList[1].y
    ) {
      path += `M${this.pointList[0].x},${this.pointList[1].y}`;
      path += `L${this.pointList[0].x},${this.pointList[1].y}`;
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
      path += `Z `;
    }

    return path;
  }
}
/** 自定义多线段箭头 */
class MarkPolylineArrowObject extends ClickMarkObject {
  constructor(box) {
    super(box);
    this.type = "polyline_arrow";
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
/** 自定义三角形 */
class MarkTriangleObject extends MoveMarkObject {
  constructor(box) {
    super(box);
    this.type = "triangle";
  }
  setMoveEdit(offset) {
    if (this.acctivePointIndex == 0) {
      this.pointList[0] = {
        x: this.pointList[0].x + offset.x,
        y: this.pointList[0].y + offset.y,
      };
    } else if (this.acctivePointIndex === 1) {
      this.pointList[1] = {
        x: this.pointList[1].x + offset.x,
        y: this.pointList[1].y + offset.y,
      };
    } else if (this.acctivePointIndex === 2) {
      this.pointList[0] = {
        x: this.pointList[0].x + offset.x,
        y: this.pointList[0].y,
      };
      this.pointList[1] = {
        x: this.pointList[1].x,
        y: this.pointList[1].y + offset.y,
      };
    }
  }
  /** 获取path  */
  get pathData() {
    let path = ``;
    if (this.vertexList.length) {
      this.vertexList.forEach((point, index) => {
        // 绘制线段
        if (index === 0) {
          path += `M${point.x},${point.y}`;
        } else {
          path += `L${point.x},${point.y}`;
        }
      });
      path += `Z `;
    }
    return path;
  }
  /** 获取三角形顶点 */
  get vertexList() {
    if (this.pointList.length === 2) {
      return [
        {
          x: (this.pointList[0].x + this.pointList[1].x) / 2,
          y: this.pointList[0].y,
        },
        this.pointList[1],
        { x: this.pointList[0].x, y: this.pointList[1].y },
      ];
    } else {
      return [];
    }
  }
  get indexPoint() {
    return this.vertexList[0];
  }
  /** 获取三角形结果点 */
  get resultPoints() {
    return this.vertexList;
  }
}

function onload() {
  document.getElementById("upload").onclick = upload;
  document.getElementById("clear").onclick = clear;
  document.getElementById("importJson").onclick = importJson;
  document.getElementById("creact").onclick = creact;
  document.getElementById("destroy").onclick = destroy;
  var mark;
  var markObjectList = [];
  var labelInputElm = document.querySelector("#labelInput");
  let colorInputElm = document.querySelector("#colorInput");
  var textareaElm = document.querySelector("#textarea");
  var labelInput = labelInputElm.value;
  let colorInput = colorInputElm.value;

  labelInputElm.onchange = (e) => {
    labelInput = e.target.value;
  };
  colorInputElm.onchange = (e) => {
    colorInput = e.target.value;
  };
  creactShapeIcon();
  // 创建
  creact();

  document.querySelector(".mark-operate").onclick = setDrawType;

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
  function setDrawType(e) {
    if (e.target.dataset.type) {
      mark.setDrawType(e.target.dataset.type);
    }
  }
  // 上传图片
  function upload() {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = function (e) {
      var file = e.target.files[0];
      if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
          mark?.setBackground(e.target.result).then(() => {
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
    mark.register("sides_arrow", MarkSidesArrowObject);
    mark.register("polyline_arrow", MarkPolylineArrowObject);
    mark.register("triangle", MarkTriangleObject);
    mark.setDrawType(mark.currentDrawingType || "rect");
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
    mark.setObjectData(json);
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

    document.getElementById("mark-list-ul").onclick = (e) => {
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
window.onload = onload;

```
:::