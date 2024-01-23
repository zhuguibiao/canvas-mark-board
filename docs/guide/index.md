# 开始

## 简介
`canvas-mark-board` 基于原生canvas封装的图像标注工具，用于在 vue/react/原生js 应用中都可以实现标注功能。它提供了一系列事件和方法，用于管理标注对象、绘制标注形状、导入标注数据等操作。

[原生js在线演示](https://zhuguibiao.github.io/canvas-mark-board/js-demo/)

[vue在线演示](https://zhuguibiao.github.io/canvas-mark-board/vue-demo/)

[react在线演示](https://zhuguibiao.github.io/canvas-mark-board/react-demo/)

## 安装
::: code-group

```sh [pnpm]
$ pnpm add canvas-mark-board
```
```sh [npm]
$ npm install canvas-mark-board
```
```sh [yarn]
$ yarn add canvas-mark-board
```
:::


## 使用

::: code-group

```js  [js]
/** link js*/
// <srcipt src="https://www.unpkg.com/canvas-mark-board@0.0.1-beta.4/dist/index.umd.js"></srcipt>  

const mark = new CanvasMarkBoard({
  view: "#mark-box", // dom 选择器
})
mark.setDrawType('rect')
mark.on('oncomplete',(e)=>{e.ok({})})

```
```tsx  [vue]
import CanvasMarkBoard from 'canvas-mark-board'
import { ref } from "vue";
const mark = ref(null);

mark.value = new CanvasMarkBoard({
  view: "#mark-box", // dom 选择器
})
mark.value.setDrawType('rect')
mark.value.on('oncomplete',(e)=>{e.ok({})})

```

```tsx  [react]
import CanvasMarkBoard from 'canvas-mark-board'
const mark = new CanvasMarkBoard({
  view: "#mark-box", // dom 选择器
})
mark.setDrawType('rect')
mark.on('oncomplete',(e)=>{e.ok({})})
```
:::



## 配置项
- `config` 配置项
```javascript
 new CanvasMarkBoard({
  lineWidth: 2,
  drawColor: 'yellow', // 绘制中的颜色
  fillColor: 'rgba(255,255,255,.5)'; // 选中填充颜色
  showIndex: true; // 是否显示index
  disableZoom: false; // 是否关闭缩放画板功能
  disableMove: false; // 是否关闭移动画板功能
});
```
