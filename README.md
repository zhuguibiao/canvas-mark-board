# canvas-mark-board

## 简介
`canvas-mark-board` 基于原生canvas封装的图像标注工具，用于在 vue/react/原生js 应用中都可以实现标注功能。它提供了一系列事件和方法，用于管理标注对象、绘制标注形状、导入标注数据等操作。

[原生js在线演示]()

[vue在线演示]()

[react在线演示]()


## 安装
```shell
pnpm install canvas-mark-board
npm install canvas-mark-board
yarn install canvas-mark-board

```
## 使用
```typescript
import CanvasMarkBoard from 'canvas-mark-board'
// import bgImage from './bgImage.jpg'
const mark = new CanvasMarkBoard({
  view: "#mark-box", // dom 选择器
})
// mark.value.setBackground(bgImage)
mark.value.setDrawType('rect')
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
