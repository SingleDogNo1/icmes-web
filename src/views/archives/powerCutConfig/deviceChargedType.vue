<template>
  <div class="DeviceChargedType">
    {{ msg }}
  </div>
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
