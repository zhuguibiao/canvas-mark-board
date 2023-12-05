# 事件


### `onchange`
- 描述：当标注对象发生变化时触发，例如添加、删除或修改标注对象。
- 示例：
```typescript
mark.on("onchange", () => {
  objectList = JSON.parse(JSON.stringify(mark.objects))
})
```

### `ondraw`
- 描述：当画布绘制模式发生变化时触发。
- 参数：`e` - 绘制模式对象，包含 `type` 属性，表示当前绘制模式的类型。
- 示例：
```typescript
mark.on("ondraw", (e) => {
  drawType.value = e.type as string
})
```

### `oncomplete`
- 描述：当标注对象完成时触发。
- 参数：`e` - 标注对象完成处理函数，包含 `ok` 和 `err` 两个方法，用于接受或拒绝标注对象的标签数据。
- 示例：
```typescript
mark.on("oncomplete", (e) => {
   e.ok(data)
   // e.err(data)
})
```


### `onmove`
- 描述：当画布移动状态发生变化时触发。
- 参数：`e` - 移动状态对象，包含 `status` 属性，表示移动状态是否为 `true`。
- 示例：
```typescript
mark.on("onmove", ({status}) => {})
```

### `ontransform`
- 描述：当画布放大缩小移动时。
- 参数：`t` - [canvas transform参数](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform ) 。
- 可以用来改变背景图片或者视频等
- 示例：
```typescript
mark.on("ontransform",({t}) => {
  img.style.transformOrigin! = `${t.e}px ${t.f}px`;
  img.style.transform! = `scale(${t.a}) translate(${t.e}px,${t.f}px)`;
})
```
