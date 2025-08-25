<h1 align="center">canvas-mark-board</h1>
<div align="center">

English | [简体中文](./README.md) 

</div>

<p align="center">
  <a href="https://www.npmjs.com/package/canvas-mark-board">
    <img src="https://img.shields.io/npm/v/canvas-mark-board?style=flat-square&color=00a8f0" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/canvas-mark-board">
    <img src="https://img.shields.io/npm/dm/canvas-mark-board?style=flat-square&color=00a8f0" alt="downloads" />
  </a>
</p>

**canvas-mark-board** image annotation tool based on  canvas package, in vue / react / native js applications can realize the annotation function. Provides a series of events and methods for managing labeled objects, drawing labeled shapes, importing labeled data and other operations.

note：Currently a beta version, later api and architecture may change, pay attention to the update

[js-demo](https://zhuguibiao.github.io/canvas-mark-board/js-demo/)
[vue-demo](https://zhuguibiao.github.io/canvas-mark-board/vue-demo/)
[react-demo](https://zhuguibiao.github.io/canvas-mark-board/react-demo/)

## Doc
[Doc Link](https://zhuguibiao.github.io/canvas-mark-board/)


## Install

```shell
pnpm add canvas-mark-board
npm install canvas-mark-board
yarn add canvas-mark-board
```

## Use

### Module
```tsx
import CanvasMarkBoard from 'canvas-mark-board'
const mark = new CanvasMarkBoard({
  view: "#mark-box", // dom 
})
mark.setDrawType('rect')
mark.on('oncomplete',(e)=>{e.ok({})})
```

### Browser 
```html
 <srcipt src="https://www.unpkg.com/canvas-mark-board@0.0.1-beta.8/dist/index.umd.js"></srcipt>  
```
```js 
const mark = new CanvasMarkBoard({
  view: "#mark-box", // dom 
})
mark.setDrawType('rect')
mark.on('oncomplete',(e)=>{e.ok({})})
```

### ESM 
```js 
import { CanvasMarkBoard } from 'https://www.unpkg.com/canvas-mark-board@0.0.1-beta.8/dist/index.esm.js'

const mark = new CanvasMarkBoard({
  view: "#mark-box", // dom 
})
mark.setDrawType('rect')
mark.on('oncomplete',(e)=>{e.ok({ label:'person', color:'blue' })})
```

## Custom Marks
[custom Marks doc](https://zhuguibiao.github.io/canvas-mark-board/guide/register.html)

## Config
- `config` 
```javascript
 new CanvasMarkBoard({
  lineWidth: 2,
  drawColor: 'yellow',
  fillColor: 'rgba(255,255,255,.5)';
  showLabel: false 
  disableZoom: false;
  disableMove: false;
});
```

## Dev
```sh
pnpm install 
pnpm dev
```


## ChangeLog

[ChangeLog](./changelog.md)
