<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import CanvasMarkBoard from "canvas-mark-board";
import jsonData from "../../assets/data.json";
import img from "../../assets/image.jpg";
import shapeTypeList from "../../assets/shapeMap.json";

import {
  MarkSidesArrowObject,
  MarkPolylineArrowObject,
  MarkTriangleObject,
  MarkDotObject,
  MarkRotateRectObject,
} from "custom-mark";

const objectListJson = computed(() => {
  return JSON.stringify(objectList.value);
});
var moveStatus = ref<boolean>(false);
var drawType = ref<string>("");
var mark = ref<CanvasMarkBoard | null>(null);
var selectStatus = ref<boolean>(true);

function setDrawType(type: any) {
  mark.value?.setDrawType(type);
}
var labelInput = ref<string>("person");
var colorInput = ref<string>("#ff0000");
var objectList = ref<any[]>([]);

onMounted(() => {
  createMark();
});

var jsonValue = ref<string>("");

function importJSON() {
  try {
    mark.value?.setObjectData(jsonData as any);
  } catch (err) {
    alert("JSON格式错误");
  }
}

function createMark() {
  if (mark.value) return;
  mark.value = new CanvasMarkBoard({
    view: "#mark-box",
     showIndex: false,
  });

  mark.value.register("sides_arrow", MarkSidesArrowObject);
  mark.value.register("polyline_arrow", MarkPolylineArrowObject);
  mark.value.register("triangle", MarkTriangleObject);
  mark.value.register("dot", MarkDotObject);
  mark.value.register("rotateRect", MarkRotateRectObject);

  mark.value.setBackground(img).then(() => {
    mark.value?.setDrawType("rect");
  });
  mark.value.on("onselect", (e) => {
    selectStatus.value = e.status;
  });
  mark.value.on("ondraw", (e) => {
    drawType.value = e.type;
  });
  mark.value.on("oncomplete", (e) => {
    e.ok({ label: labelInput.value, color: colorInput.value });
  });
  mark.value.on("onchange", () => {
    objectList.value = JSON.parse(JSON.stringify(mark.value?.objects));
  });
}

function clearCanvas() {
  mark.value?.clearMarkShapes();
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
        mark.value?.setBackground((e.target as any).result);
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
}

function selectObj(id: string) {
  mark.value?.selectObjectById(id);
}
</script>

<template>
  <div class="page">
    <h3>VUE canvas-mark-board Demo:</h3>
    <div class="tools_bar">
      <button
        :key="index"
        v-for="(item, index) in shapeTypeList"
        @click="setDrawType(item.type)"
        :style="{
          background:
            mark?.currentDrawingType == item.type ? '#000' : 'transparent',
        }"
      >
        <svg
          :viewBox="item.viewBox"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
        >
          <path
            :d="item.icon"
            :fill="mark?.currentDrawingType === item.type ? '#FFF' : '#333333'"
          ></path>
        </svg>
      </button>
      <button @click="clearCanvas">清空画布</button>
      <button @click="uploadImage">上传图片</button>
      <button @click="importJSON">导入JSON</button>
      <button @click="createMark">创建</button>
      <button
        @click="
          mark.destroy();
          mark = undefined;
        "
      >
        销毁
      </button>

      标签名：<input type="text" v-model="labelInput" /> 颜色：<input
        type="color"
        v-model="colorInput"
      />
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
          2.按Delete键删除对象
        </div>
      </a>
    </div>
    <div class="mark-box">
      <div id="mark-box" />
      <div class="object-list">
        <div
          @click="mark.selectObjectById(item.id)"
          v-for="(item, index) in objectList"
          :key="index"
          :style="{
            background: mark?.selectObject?.id == item.id ? '#ccc' : '#fff',
          }"
        >
          <span>{{ item.label }}</span>
          <button @click="mark.deleteObject(item.id)">删除</button>
        </div>
      </div>
    </div>
    <textarea v-model="objectListJson" cols="30" rows="10"></textarea>
  </div>
</template>

<style scoped >
.page {
  width: 80%;
  margin: 0 auto;
  max-width: 1440px;
}
h3 {
  margin: 0;
}
.mark-box {
  display: flex;
  height: calc(80vh - 100px);
  width: 100%;
}
.object-list {
  width: 150px;
}
textarea {
  width: 100%;
}
#mark-box {
  flex: 1;
  height: 100%;
  margin-right: 10px;
  border: 1px solid #ccc;
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
</style>