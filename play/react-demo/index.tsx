import MarkBoard from "canvas-mark-board";
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import jsonData from "../../assets/data.json";
import img from "../../assets/image.jpg";

const shapeTypeList = [
  {
    viewBox: "0 0 1024 1024",
    type: "rect",
    icon: `M904.50393 795.651268V225.084385c32.463366-10.869558 55.862285-41.503253 55.862286-77.623915 0-45.212738-36.647665-81.863473-81.864496-81.863473-35.721573 0-66.084091 22.890336-77.262688 54.798047H226.150158c-11.177574-31.907711-41.538045-54.79907-77.262688-54.79907-45.213761 0-81.864496 36.651758-81.864496 81.864496 0 35.530215 22.63758 65.76175 54.271045 77.086679v571.642379c-31.633465 11.32493-54.271044 41.555441-54.271045 77.084632 0 45.212738 36.652781 81.864496 81.864496 81.864496 34.495652 0 63.98222-21.342074 76.036767-51.532677h577.543786c12.05557 30.190603 41.546232 51.532677 76.035743 51.532677 45.217854 0 81.864496-36.651758 81.864496-81.864496-0.002047-36.120662-23.400966-66.753333-55.864332-77.622892z m-105.182574 56.789401H228.067834c-7.227612-27.548426-28.447912-49.415456-55.609529-57.570183V225.865167c26.077935-7.829316 46.683229-28.300556 54.682414-54.305836H800.249495c7.835456 25.473161 27.768437 45.63434 53.090149 53.80851V795.367813c-26.39516 8.519024-46.930869 30.065759-54.018288 57.072856z`,
  },
  {
    viewBox: "0 0 1024 1024",
    type: "polygon",
    icon: `M680.71 915.22H343.29c-39.53 0-76.37-21.27-96.12-55.52L78.46 567.49c-19.75-34.22-19.75-76.77 0-110.99l168.71-292.2c19.75-34.24 56.6-55.52 96.12-55.52h337.42c39.53 0 76.37 21.27 96.12 55.52l168.71 292.2c19.75 34.22 19.75 76.77 0 110.99L776.83 859.7c-19.75 34.24-56.59 55.52-96.12 55.52zM343.29 175.69c-15.7 0-30.35 8.43-38.21 22.04l-168.71 292.2c-7.84 13.61-7.84 30.52 0 44.13l168.71 292.2c7.86 13.61 22.51 22.04 38.21 22.04h337.42c15.7 0 30.35-8.43 38.21-22.04l168.71-292.2c7.84-13.61 7.84-30.52 0-44.13l-168.71-292.2c-7.86-13.61-22.51-22.04-38.21-22.04H343.29z`,
  },
  {
    viewBox: "0 0 1152 1024",
    type: "sides_polygon",
    icon: `M628.992 625.472l276.672 107.776-79.872 64 147.712 147.776a39.68 39.68 0 0 1-55.936 56.064l-153.984-153.984-89.6 71.936-44.992-293.568zM858.368 2.56l281.088 486.848-130.56 226.112a39.616 39.616 0 0 1-68.544-39.616l107.648-186.496-235.392-407.68H341.888l-235.392 407.68 235.392 407.68h234.496a39.552 39.552 0 1 1 0 79.168H296.192L15.04 489.344 296.192 2.56h562.176z`,
  },
  {
    viewBox: "0 0 1024 1024",
    type: "circle",
    icon: `M512 928C282.624 928 96 741.376 96 512S282.624 96 512 96s416 186.624 416 416-186.624 416-416 416z m0-768C317.92 160 160 317.92 160 512s157.92 352 352 352 352-157.92 352-352S706.08 160 512 160z`,
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
];
function Index() {
  const mark = useRef<MarkBoard>();
  const labelRef = useRef(null);
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
    });
    mark.current.on("ondraw", (e) => {
      mark.current!.currentDrawingType = e.type;
    });
    mark.current.on("oncomplete", (e) => {
      e.ok({ label: labelRef.current!.value });
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
