# Image

用于展示图片即预览

## Usage

```vue
<template>
  <Image
    :width="200"
    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
  />
  <ImagePreviewGroup :images="images" :image-width="200" />
</template>

<script lang="ts" setup name="ImageDemo">
  import { Image, ImagePreviewGroup } from '/@/components/Image';

  const images = [
    'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
    'https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp',
    'https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp',
  ];
</script>
```

## Image Props

| 属性     | 类型                     | 默认值  | 可选值 | 说明                   |
| -------- | ------------------------ | ------- | ------ | ---------------------- |
| fallback | `string`                 | -       | -      | 加载失败显示的占位图片 |
| src      | `string`                 | -       | -      | 图片地址               |
| preview  | `boolean ｜ previewType` | `false` | -      | 预览参数               |
| width    | `number`                 | -       | -      | 图片宽度               |
| height   | `number`                 | -       | -      | 图片高度               |

**previewType**

参照[ant-design Image 组件](https://www.antdv.com/components/image-cn#previewType)

```ts
visible?: boolean;
onVisibleChange?: (visible, prevVisible) => void;
getContainer: string | HTMLElement | (() => HTMLElement);
src?: string;
maskClassName?: string;
current?: number;
```
