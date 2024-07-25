import MarkBoard from "canvas-mark-board";
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import jsonData from "../../assets/data.json";
import {
  MarkSidesArrowObject,
  MarkPolylineArrowObject,
  MarkTriangleObject,
} from "custom-mark";
import img from "../../assets/image.jpg";
import shapeTypeList from "../../assets/shapeMap.json";

function Index() {
  const mark = useRef<MarkBoard>();
  const labelRef = useRef(null);
  const colorRef = useRef(null);
  const [objectList, setObjectList] = useState<any>([]);

  useEffect(() => {
    const mark = createMark();
    return () => {
      return mark?.destroy();
    };
  }, []);

  function createMark() {
    if (mark.current) return;
    mark.current = new MarkBoard({
      view: "#mark-box", // ID名或者DOM对象
      lineWidth: 2,
      showIndex: false,
    });
    mark.current.register("sides_arrow", MarkSidesArrowObject);
    mark.current.register("polyline_arrow", MarkPolylineArrowObject);
    mark.current.register("triangle", MarkTriangleObject);

    mark.current.on("ondraw", (e) => {
      mark.current!.currentDrawingType = e.type;
    });
    mark.current.on("oncomplete", (e) => {
      e.ok({ label: labelRef.current!.value, color: colorRef.current!.value });
    });
    mark.current.on("onchange", () => {
      setObjectList(mark.current.objects);
    });
    mark.current.setBackground(img).then(() => {
      mark.current?.setDrawType("rect");
    });
    return mark.current;
  }
  function setMode(type: any) {
    mark.current?.setDrawType(type);
  }
  function uploadImage() {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = function (e) {
      let file = (e.target as any).files[0];
      if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
          mark.current?.setBackground((e.target as any).result).then(() => {
            mark.current.setDrawType(mark.current.currentDrawingType || "rect");
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }
  function exportJson() {
    mark.current?.setObjectData(jsonData as any);
  }

  return (
    <div style={{ width: "80vw", maxWidth: 1440, margin: "0 auto" }}>
      <h3 style={{ margin: 0 }}>React canvas-mark-board Demo:</h3>
      <div>
        {shapeTypeList?.map((item, index) => {
          return (
            <button
              key={index}
              style={{
                background:
                  mark.current?.currentDrawingType === item.type
                    ? "#000"
                    : "transparent",
              }}
              onClick={() => {
                setMode(item.type);
              }}
            >
              <svg
                viewBox={item.viewBox}
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
              >
                <path
                  d={item.icon}
                  fill={
                    mark.current?.currentDrawingType === item.type
                      ? "#FFF"
                      : "#333333"
                  }
                ></path>
              </svg>
            </button>
          );
        })}
        <button onClick={uploadImage}>上传图片</button>
        <button
          onClick={() => {
            mark.current?.clearMarkShapes();
          }}
        >
          清空画布
        </button>
        <button onClick={exportJson}>导入JSON</button>
        <button onClick={createMark}>创建</button>
        <button
          onClick={() => {
            mark.current?.destroy();
            mark.current = undefined;
          }}
        >
          销毁
        </button>
        标签名：
        <input ref={labelRef} type="text" defaultValue="person" />
        颜色：
        <input ref={colorRef} type="color" defaultValue="#ff0000" />
        <a className="remark">
          操作说明?
          <div>
            <b>画布操作</b>：1.双击鼠标恢复大小; 2.ctrl或cmd或alt+滚轮缩放;
            3.按住空格拖动画布
            <br />
            <b>多边形绘制</b>：1.右键删除最后一个点;
            2.点击第一个点或者按回车完成绘制
            <br />
            <b>其他操作</b>：1.可以点击图形然后拖动，调整点拖动改变大小;
            2.按Delete键删除对象
          </div>
        </a>
      </div>
      <div style={{ display: "flex", height: "calc(80vh - 100px)" }}>
        <div style={{ flex: 1 }}>
          <div
            id="mark-box"
            style={{
              height: "100%",
              width: `100%`,
              border: "1px solid #ccc",
            }}
          ></div>
        </div>
        <div
          style={{
            width: "200px",
            height: "100%",
            overflow: "auto",
          }}
        >
          {objectList.map((item: any, index: number) => {
            return (
              <div
                style={{
                  marginLeft: 10,
                  display: "flex",
                  background:
                    mark.current?.selectObject?.id == item.id ? "#ccc" : "#fff",
                }}
                key={index}
                onClick={() => {
                  mark.current?.selectObjectById(item.id);
                }}
              >
                <div>{item.label}</div>
                <button
                  onClick={() => {
                    mark.current?.deleteObject(item.id);
                  }}
                >
                  删除
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <textarea
        style={{ width: "100%" }}
        value={JSON.stringify(objectList)}
        cols={30}
        rows={10}
      ></textarea>
    </div>
  );
}
const root = createRoot(document.getElementById("root"));
root.render(<Index />);
