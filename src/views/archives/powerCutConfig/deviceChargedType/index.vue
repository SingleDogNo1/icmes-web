<template>
  <PageWrapper contentFullHeight fixedHeight dense>
    <div class="h-full p-4 mt-4 overflow-auto bg-white"> {{ msg }} </div>
  </PageWrapper>
</template>

<script lang="ts">
  export default {
    name: 'DeviceChargedType',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, DeviceChargedType');
</script>

<style lang="less" scoped>
  .DeviceChargedType {
    color: red;
  }
</style>
