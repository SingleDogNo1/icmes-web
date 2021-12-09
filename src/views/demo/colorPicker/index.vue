<template>
  <PageWrapper>
    <ColorPicker @changeColor="changeColor" />
    <div>{{ color }}</div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { ColorPicker } from '/@/components/ColorPicker';

  const color = ref('');

  function changeColor({ rgba, hsv, hex }) {
    console.log('rgba, hsv, hex :>> ', rgba, hsv, hex);
    const { r, g, b, a } = rgba;

    color.value = `rgba(${r}, ${g}, ${b}, ${a})`;
  }
</script>
