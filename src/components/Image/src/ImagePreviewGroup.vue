<template>
  <ImagePreviewGroup>
    <BasicImage v-for="item in images" :key="item" :src="item" :width="imageWidth" preview />
  </ImagePreviewGroup>
</template>

<script lang="ts" setup name="ImagePreviewGroup">
  import { Image } from 'ant-design-vue';
  import BasicImage from './Image.vue';

  const ImagePreviewGroup = Image.PreviewGroup;

  interface Props {
    images: string[];
    imageWidth?: number | string;
  }

  withDefaults(defineProps<Props>(), {});
</script>
