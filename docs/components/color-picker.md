# 取色器组件

可以选择颜色组件

## Usage

```vue
<template>
  <ColorPicker @changeColor="changeColor" />
</template>
<script lang="ts" setup>
  import { ColorPicker } from '/@/components/ColorPicker';

  function changeColor({ rgba, hsv, hex }) {
    console.log('rgba, hsv, hex :>> ', rgba, hsv, hex);
  }
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| theme | `dark｜light` | `dark` | 取色器主题 |
| color | string | `#000000` | 默认颜色 |
| colors-default | string[] | `['#000000', '#FFFFFF', '#FF1900', '#F47365', '#FFB243', '#FFE623', '#6EFF2A', '#1BC7B1', '#00BEFF', '#2E81FF', '#5D61FF', '#FF89CF', '#FC3CAD', '#BF3DCE', '#8E00A7', 'rgba(0,0,0,0)']` | 设置好的预选颜色列表 |

## Event

| Name        | Type                       | Args  | Desc               |
| ----------- | -------------------------- | ----- | ------------------ |
| changeColor | ({rgba, hsv, hex}) => void | color | 取色值改变后的回调 |
