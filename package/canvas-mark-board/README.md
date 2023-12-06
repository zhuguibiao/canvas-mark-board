# canvas-mark-board

## 简介
`canvas-mark-board` 基于原生canvas封装的图像标注工具，用于在 vue/react/原生js 应用中都可以实现标注功能。它提供了一系列事件和方法，用于管理标注对象、绘制标注形状、导入标注数据等操作。

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
```typescript
import CanvasMarkBoard from 'canvas-mark-board'
// import bgImage from './bgImage.jpg'
const mark = new CanvasMarkBoard({
  view: "#mark-box", // dom 选择器
})
// mark.value.setBackground(bgImage)
mark.setDrawType('rect')
mark.on('oncomplete',(e)=>{e.ok({})})
```


## 配置项
- `config` 配置项
```javascript
{
  lineWidth: 2,
  color: 'red',   // 最终呈现颜色
  drawColor: 'yellow', // 绘制中的颜色
}
```
