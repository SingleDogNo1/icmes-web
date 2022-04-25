<template>
  <div class="w-full h-full bg-white">
    {{ msg }}
  </div>
</template>

<script lang="ts">
  export default {
    name: 'SignalPoint',
  };
</script>

<script lang="ts" setup>
  import { ref } from 'vue';

  const msg = ref('hello, collocationObj');
</script>

<style lang="less" scoped>
  .collocationObj {
    color: red;
  }
</style>
