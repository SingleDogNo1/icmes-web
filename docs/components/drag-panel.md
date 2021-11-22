# Basic 基础组件

用于创建可拆分可拖拽的面板布局

## Usage

```vue
<template>
  <split-pane @resize="resize" :min-percent="20" :default-percent="30" split="vertical">
    <template slot="paneL"> A </template>
    <template slot="paneR"> B </template>
  </split-pane>
</template>
<script setup>
  import { DragPanel } from '/@/components/DragPanel';
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| split | `horizontal｜vertical` | - | 拆分方式，必填 |
| min-percent | number | 10 | 左侧面板最小比例（上下拆分时表示上方面板最小高度，左右拆分表示左侧面板最小宽度） |
| max-percent | number | 10 | 左侧面板最小比例（上下拆分时表示上方面板最大高度，左右拆分表示左侧面板最大宽度） |
