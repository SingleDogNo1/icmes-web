# GridLayout

类似于[Gridster](http://dsmorse.github.io/gridster.js/)的栅格布局系统。

## Usage

```vue
<template>
  <GridLayout v-model:layout="layout">
    <GridItem />
  </GridLayout>
</template>
<script lang="ts">
  import { GridLayout, GridItem } from '/@/components/GridLayout';

  let layout = [
    { x: 0, y: 0, w: 2, h: 3, i: '0', static: false, minH: 3, maxH: 5 },
    { x: 2, y: 0, w: 2, h: 4, i: '1', static: true },
    { x: 4, y: 0, w: 2, h: 5, i: '2', static: false, minH: 4, maxH: 4, minW: 2, maxW: 2 },
    { x: 6, y: 0, w: 2, h: 3, i: '3', static: false },
    { x: 8, y: 0, w: 2, h: 3, i: '4', static: false },
    { x: 10, y: 0, w: 2, h: 3, i: '5', static: false },
    { x: 0, y: 5, w: 2, h: 5, i: '6', static: false },
    { x: 2, y: 5, w: 2, h: 5, i: '7', static: false },
    { x: 4, y: 5, w: 2, h: 5, i: '8', static: false },
    { x: 6, y: 3, w: 2, h: 4, i: '9', static: true },
    { x: 8, y: 4, w: 2, h: 4, i: '10', static: false },
    { x: 10, y: 4, w: 2, h: 4, i: '11', static: false, minH: 4 },
    { x: 0, y: 10, w: 2, h: 5, i: '12', static: false },
    { x: 2, y: 10, w: 2, h: 5, i: '13', static: false },
    { x: 4, y: 8, w: 2, h: 4, i: '14', static: false },
    { x: 6, y: 8, w: 2, h: 4, i: '15', static: false },
    { x: 8, y: 10, w: 2, h: 5, i: '16', static: false },
    { x: 10, y: 4, w: 2, h: 2, i: '17', static: false },
    { x: 0, y: 9, w: 2, h: 3, i: '18', static: false },
    { x: 2, y: 6, w: 2, h: 2, i: '19', static: false },
  ];
</script>
```

`GridLayout` 和 `GridItem` 参数及方法详情如下

## Props

### GridLayout

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| layout | `Layout` | 必填 | 布局数据源 |
| colNum | `number` | `12` | 栅格系统的列数 |
| rowHeight | `number` | `150` | 宫格的单位的高度(px) |
| maxRows | `number` | `Infinity` | 定义最大行数 |
| margin | `number[]` | `[10, 10]` | 栅格的间距(px)，数组第一个位表示水平间距，第二位表示垂直间距 |
| isDraggable | `boolean` | `true` | 栅格元素是否可拖拽 |
| isResizable | `boolean` | `true` | 栅格元素是否可调整大小 |
| isMirrored | `boolean` | `false` | 栅格元素是否可镜像翻转 |
| autoSize | `boolean` | `true` | 容器是否自动调整大小 |
| verticalCompact | `boolean` | `true` | 布局是否垂直压缩 |
| useCssTransforms | `boolean` | `true` | 是否使用 CSS transform 属性 |
| responsive | `boolean` | `false` | 布局是否为响应式 |
| breakpoints | `object` | `{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }` | 响应式布局断点 |
| cols | `object` | `{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }` | 响应式布局中每个断点对应的列数 |

### GridItem

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| i | `string` | 必填 | 元素的唯一标识 |
| x | `number` | 必填 | 元素位于第几列 |
| y | `number` | 必填 | 元素位于第几行 |
| w | `number` | 必填 | 元素的初始宽度(占全部宽度(`GridLayoutProps.cols`)中的几份) |
| h | `number` | 必填 | 元素的初始高度(`GridLayoutProps.rowHeight`的倍数) |
| minW | `number` | `1` | 元素的最小宽度(占全部宽度(`GridLayoutProps.cols`)中的 1 份) |
| maxW | `number` | `Infinity` | 元素的最大宽度 |
| minH | `number` | `1` | 元素的最小高度(`GridLayoutProps.rowHeight`的倍数) |
| maxH | `number` | `Infinity` | 元素的最大高度 |
| static | `boolean` | `false` | 元素是否为静态(无法拖拽、调整大小或被其他元素移动) |
| dragIgnoreFrom | `string` | `a, button` | 元素中哪些子元素无法触发拖拽事件，值为`HTML`标签。 |
| dragAllowFrom | `string` | `null` | 元素中哪些子元素可以触发拖拽事件，值为`HTML`标签。 为`null`表示所有元素 |
| resizeIgnoreFrom | `string` | `a, button` | 元素中哪些子元素无法触发调整大小事件，值为`HTML`标签。 |

## Events

| 方法名                 | 说明                             |
| ---------------------- | -------------------------------- |
| layoutCreatedEvent     | 对应`Vue`生命周期的`created`     |
| layoutBeforeMountEvent | 对应`Vue`生命周期的`beforeMount` |
| layoutMountedEvent     | 对应`Vue`生命周期的`mounted`     |
| layoutReadyEvent       | 当完成`mount`中的所有操作时触发  |
| layoutUpdatedEvent     | 布局更新时触发                   |
| moveEvent              | 元素移动时的事件                 |
| resizeEvent            | 元素调整大小时的事件             |
| movedEvent             | 移动完成的事件                   |
| resizedEvent           | 调整大小后的事件                 |
