# canvas-mark-board&middot; [![npm version](https://img.shields.io/npm/v/canvas-mark-board)](https://www.npmjs.com/package/canvas-mark-board)

## 简介
`canvas-mark-board` 基于原生canvas封装的图像标注工具，在 vue / react / 原生js 应用中都可以实现标注功能。提供了一系列事件和方法，用于管理标注对象、绘制标注形状、导入标注数据等操作。

注：目前是beta版本，后期api和架构可能会change，关注update

[原生js在线演示](https://zhuguibiao.github.io/canvas-mark-board/js-demo/)

[vue在线演示](https://zhuguibiao.github.io/canvas-mark-board/vue-demo/)

[react在线演示](https://zhuguibiao.github.io/canvas-mark-board/react-demo/)

## 文档
[文档](https://zhuguibiao.github.io/canvas-mark-board/)


## 安装

```shell
pnpm add canvas-mark-board
npm install canvas-mark-board
yarn add canvas-mark-board
```

## 使用

### 工具模块使用
```tsx
import CanvasMarkBoard from 'canvas-mark-board'
const mark = new CanvasMarkBoard({
  view: "#mark-box", // dom 选择器
})
mark.setDrawType('rect')
mark.on('oncomplete',(e)=>{e.ok({})})
```

### CDN 使用
```html
 <srcipt src="https://www.unpkg.com/canvas-mark-board@0.0.1-beta.5/dist/index.umd.js"></srcipt>  
```
```js 
const mark = new CanvasMarkBoard({
  view: "#mark-box", // dom 选择器
})
mark.setDrawType('rect')
mark.on('oncomplete',(e)=>{e.ok({})})
```

### ESM 使用
```js 
import { CanvasMarkBoard } from 'https://www.unpkg.com/canvas-mark-board@0.0.1-beta.4/dist/index.esm.js'

const mark = new CanvasMarkBoard({
  view: "#mark-box", // dom 选择器
})
mark.setDrawType('rect')
mark.on('oncomplete',(e)=>{e.ok({ label:'person', color:'blue' })})
```

## 自定义图形
[自定义图形](https://zhuguibiao.github.io/canvas-mark-board/guide/register.html)

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
